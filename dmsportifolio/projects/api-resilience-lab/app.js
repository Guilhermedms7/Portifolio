const elements = {
  failureRate: document.querySelector("#failure-rate"),
  failureValue: document.querySelector("#failure-value"),
  latency: document.querySelector("#latency"),
  latencyValue: document.querySelector("#latency-value"),
  retryStrategy: document.querySelector("#retry-strategy"),
  maxRetries: document.querySelector("#max-retries"),
  retryEnabled: document.querySelector("#retry-enabled"),
  breakerEnabled: document.querySelector("#breaker-enabled"),
  featureEnabled: document.querySelector("#feature-enabled"),
  batchSize: document.querySelector("#batch-size"),
  runButton: document.querySelector("#run-button"),
  resetButton: document.querySelector("#reset-button"),
  metricEvents: document.querySelector("#metric-events"),
  metricSuccess: document.querySelector("#metric-success"),
  metricDelivered: document.querySelector("#metric-delivered"),
  metricRetries: document.querySelector("#metric-retries"),
  metricBlocked: document.querySelector("#metric-blocked"),
  metricFailed: document.querySelector("#metric-failed"),
  breakerState: document.querySelector("#breaker-state"),
  breakerStateLabel: document.querySelector("#breaker-state-label"),
  breakerDescription: document.querySelector("#breaker-description"),
  activityCount: document.querySelector("#activity-count"),
  stripSummary: document.querySelector("#strip-summary"),
  eventStrip: document.querySelector("#event-strip"),
  activityBody: document.querySelector("#activity-body"),
  activityLive: document.querySelector("#activity-live"),
};

const eventTypes = [
  "pedido.criado",
  "cliente.atualizado",
  "estoque.baixo",
  "pagamento.confirmado",
  "pedido.atualizado",
];

const session = {
  nextEventNumber: 1,
  isRunning: false,
  events: [],
  metrics: {
    events: 0,
    delivered: 0,
    failed: 0,
    retries: 0,
    blocked: 0,
  },
  breaker: {
    state: "closed",
    consecutiveFailures: 0,
    openUntil: 0,
  },
};

function getSettings() {
  return {
    failureRate: Number(elements.failureRate.value),
    latency: Number(elements.latency.value),
    retryStrategy: elements.retryStrategy.value,
    maxRetries: Number(elements.maxRetries.value),
    retryEnabled: elements.retryEnabled.checked,
    breakerEnabled: elements.breakerEnabled.checked,
    featureEnabled: elements.featureEnabled.checked,
  };
}

function sleep(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function currentBreakerState(settings = getSettings()) {
  if (!settings.breakerEnabled) return "disabled";
  if (session.breaker.state === "open" && Date.now() >= session.breaker.openUntil) {
    session.breaker.state = "half-open";
  }
  return session.breaker.state;
}

function setBreakerOpen() {
  session.breaker.state = "open";
  session.breaker.openUntil = Date.now() + 8000;
  window.setTimeout(render, 8050);
}

function closeBreaker() {
  session.breaker.state = "closed";
  session.breaker.consecutiveFailures = 0;
  session.breaker.openUntil = 0;
}

function renderBreaker() {
  const settings = getSettings();
  const state = currentBreakerState(settings);
  const labels = {
    closed: "FECHADO",
    open: "ABERTO",
    "half-open": "MEIO ABERTO",
    disabled: "DESATIVADO",
  };
  const descriptions = {
    closed: "A integraÃ§Ã£o estÃ¡ recebendo eventos normalmente.",
    open: `Novas tentativas pausadas por ${Math.max(1, Math.ceil((session.breaker.openUntil - Date.now()) / 1000))} s para proteger o serviÃ§o.`,
    "half-open": "PerÃ­odo de espera concluÃ­do. O prÃ³ximo evento vai testar a integraÃ§Ã£o.",
    disabled: "ProteÃ§Ã£o desativada; as falhas nÃ£o abrem o circuito.",
  };

  elements.breakerState.className = `breaker-state state-${state.replace("-", "-")}`;
  elements.breakerStateLabel.textContent = labels[state];
  elements.breakerDescription.textContent = descriptions[state];
}

function renderMetrics() {
  const { events, delivered, failed, retries, blocked } = session.metrics;
  const completedOutcomes = delivered + failed + blocked;
  const successRate = completedOutcomes === 0 ? 0 : Math.round((delivered / completedOutcomes) * 100);

  elements.metricEvents.textContent = String(events);
  elements.metricSuccess.textContent = `${successRate}%`;
  elements.metricDelivered.textContent = `${delivered} ${delivered === 1 ? "entregue" : "entregues"}`;
  elements.metricRetries.textContent = String(retries);
  elements.metricBlocked.textContent = String(blocked);
  elements.metricFailed.textContent = `${failed} ${failed === 1 ? "falha final" : "falhas finais"}`;
}

function statusLabel(status) {
  return {
    success: "ENTREGUE",
    failed: "FALHOU",
    blocked: "BLOQUEADO",
    paused: "FLAG OFF",
    pending: "PROCESSANDO",
  }[status] ?? status.toUpperCase();
}

function renderActivity() {
  const visibleEvents = session.events.slice(0, 9);
  const counts = session.events.reduce((total, event) => {
    total[event.status] = (total[event.status] ?? 0) + 1;
    return total;
  }, {});

  elements.activityCount.textContent = `${session.events.length} ${session.events.length === 1 ? "evento" : "eventos"}`;
  elements.stripSummary.textContent = session.events.length === 0
    ? "Aguardando execuÃ§Ã£o"
    : `${counts.success ?? 0} entregues Â· ${counts.failed ?? 0} falhas Â· ${counts.blocked ?? 0} bloqueados`;

  elements.eventStrip.replaceChildren();
  session.events.slice(0, 18).reverse().forEach((event) => {
    const bar = document.createElement("span");
    bar.className = `event-bar ${event.status}`;
    bar.style.setProperty("--bar-height", `${event.plotHeight}px`);
    bar.title = `${event.id} Â· ${statusLabel(event.status)} Â· ${event.attempts} tentativas`;
    elements.eventStrip.append(bar);
  });

  elements.activityBody.replaceChildren();
  if (visibleEvents.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "Ajuste o cenÃ¡rio e execute uma simulaÃ§Ã£o para ver os eventos.";
    row.append(cell);
    elements.activityBody.append(row);
    return;
  }

  visibleEvents.forEach((event) => {
    const row = document.createElement("tr");
    row.title = event.detail;

    const idCell = document.createElement("td");
    idCell.textContent = event.id;

    const typeCell = document.createElement("td");
    typeCell.className = "event-type";
    typeCell.textContent = event.type;

    const resultCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `status-badge status-${event.status}`;
    badge.textContent = statusLabel(event.status);
    resultCell.append(badge);

    const attemptsCell = document.createElement("td");
    attemptsCell.textContent = String(event.attempts);

    const timeCell = document.createElement("td");
    timeCell.textContent = event.time;

    row.append(idCell, typeCell, resultCell, attemptsCell, timeCell);
    elements.activityBody.append(row);
  });
}

function render() {
  renderMetrics();
  renderBreaker();
  renderActivity();
}

function updateRangeDisplays() {
  const failurePercent = ((Number(elements.failureRate.value) - Number(elements.failureRate.min)) /
    (Number(elements.failureRate.max) - Number(elements.failureRate.min))) * 100;
  const latencyPercent = ((Number(elements.latency.value) - Number(elements.latency.min)) /
    (Number(elements.latency.max) - Number(elements.latency.min))) * 100;

  elements.failureRate.style.setProperty("--range-fill", `${failurePercent}%`);
  elements.latency.style.setProperty("--range-fill", `${latencyPercent}%`);
  elements.failureValue.value = `${elements.failureRate.value}%`;
  elements.latencyValue.value = `${elements.latency.value} ms`;
}

function createEvent(index) {
  const number = String(session.nextEventNumber++).padStart(4, "0");
  return {
    id: `EVT-${number}`,
    type: eventTypes[(number - 1) % eventTypes.length],
    status: "pending",
    attempts: 0,
    time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    detail: "Evento criado para a simulaÃ§Ã£o.",
    plotHeight: 9 + ((index * 7 + Number(number)) % 18),
  };
}

function backoffDelay(strategy, failedAttempt) {
  if (strategy === "fixed") return 350;
  return Math.min(250 * (2 ** (failedAttempt - 1)), 1800);
}

function recordFailure(settings) {
  if (!settings.breakerEnabled) return false;

  session.breaker.consecutiveFailures += 1;
  const state = currentBreakerState(settings);
  if (state === "half-open" || session.breaker.consecutiveFailures >= 3) {
    setBreakerOpen();
    return true;
  }
  return false;
}

function recordSuccess(settings) {
  if (!settings.breakerEnabled) return;
  closeBreaker();
}

async function processEvent(event, settings) {
  session.metrics.events += 1;

  if (!settings.featureEnabled) {
    event.status = "paused";
    event.detail = "Evento ignorado: a integraÃ§Ã£o estÃ¡ desativada pela Feature Flag.";
    elements.activityLive.textContent = `${event.id} ignorado pela Feature Flag.`;
    render();
    return;
  }

  const initialCircuitState = currentBreakerState(settings);
  if (initialCircuitState === "open") {
    session.metrics.blocked += 1;
    event.status = "blocked";
    event.detail = "A tentativa foi bloqueada enquanto o Circuit Breaker permanece aberto.";
    elements.activityLive.textContent = `${event.id} bloqueado pelo Circuit Breaker.`;
    render();
    return;
  }

  const maxAttempts = settings.retryEnabled ? settings.maxRetries + 1 : 1;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const circuitState = currentBreakerState(settings);
    if (circuitState === "open") {
      session.metrics.blocked += 1;
      event.status = "blocked";
      event.detail = "O Circuit Breaker abriu apÃ³s uma falha; as tentativas restantes foram bloqueadas.";
      elements.activityLive.textContent = `${event.id}: retries interrompidos pelo Circuit Breaker.`;
      break;
    }

    event.attempts = attempt;
    event.status = "pending";
    event.detail = `Tentativa ${attempt} em andamento.`;
    elements.activityLive.textContent = `${event.id}: executando tentativa ${attempt} de ${maxAttempts}.`;
    render();

    const jitter = Math.floor(Math.random() * 110);
    await sleep(settings.latency + jitter);
    const failed = Math.random() * 100 < settings.failureRate;

    if (!failed) {
      session.metrics.delivered += 1;
      recordSuccess(settings);
      event.status = "success";
      event.detail = `Entregue na tentativa ${attempt}, apÃ³s ${event.attempts} ${event.attempts === 1 ? "chamada" : "chamadas"}.`;
      elements.activityLive.textContent = `${event.id} entregue com sucesso na tentativa ${attempt}.`;
      render();
      return;
    }

    const breakerOpened = recordFailure(settings);
    if (attempt === maxAttempts || breakerOpened) {
      if (breakerOpened) {
        session.metrics.failed += 1;
        event.status = "failed";
        event.detail = "Falha na chamada; o Circuit Breaker abriu e encerrou novas tentativas.";
        elements.activityLive.textContent = `Circuit Breaker aberto apÃ³s falhas consecutivas. ${event.id} nÃ£o foi entregue.`;
      } else {
        session.metrics.failed += 1;
        event.status = "failed";
        event.detail = `Falhou apÃ³s ${attempt} ${attempt === 1 ? "tentativa" : "tentativas"}.`;
        elements.activityLive.textContent = `${event.id} falhou apÃ³s ${attempt} ${attempt === 1 ? "tentativa" : "tentativas"}.`;
      }
      render();
      return;
    }

    session.metrics.retries += 1;
    const delay = backoffDelay(settings.retryStrategy, attempt);
    event.detail = `Falha na tentativa ${attempt}; prÃ³ximo retry em ${delay} ms.`;
    elements.activityLive.textContent = `${event.id}: retry ${attempt} agendado para ${delay} ms.`;
    render();
    await sleep(delay);
  }
}

async function runSimulation() {
  if (session.isRunning) return;

  session.isRunning = true;
  const settings = getSettings();
  const count = Number(elements.batchSize.value);
  const formControls = document.querySelectorAll(".control-panel input, .control-panel select");
  formControls.forEach((control) => { control.disabled = true; });
  elements.runButton.disabled = true;
  elements.runButton.innerHTML = '<span class="button-spinner" aria-hidden="true"></span> Simulando eventosâ€¦';

  try {
    for (let index = 0; index < count; index += 1) {
      const event = createEvent(index);
      session.events.unshift(event);
      elements.activityLive.textContent = `${event.id} entrou na fila de simulaÃ§Ã£o.`;
      render();
      await processEvent(event, settings);
      if (index < count - 1) await sleep(120);
    }
    elements.activityLive.textContent = `SimulaÃ§Ã£o concluÃ­da: ${count} ${count === 1 ? "evento" : "eventos"} avaliados.`;
  } finally {
    session.isRunning = false;
    formControls.forEach((control) => { control.disabled = false; });
    elements.runButton.disabled = false;
    elements.runButton.innerHTML = '<span aria-hidden="true">â–¶</span> Executar simulaÃ§Ã£o';
    render();
  }
}

function resetSession() {
  if (session.isRunning) return;
  session.nextEventNumber = 1;
  session.events = [];
  session.metrics = { events: 0, delivered: 0, failed: 0, retries: 0, blocked: 0 };
  session.breaker = { state: "closed", consecutiveFailures: 0, openUntil: 0 };
  elements.activityLive.textContent = "SessÃ£o limpa. Pronto para simular.";
  render();
}

elements.failureRate.addEventListener("input", updateRangeDisplays);
elements.latency.addEventListener("input", updateRangeDisplays);
elements.breakerEnabled.addEventListener("change", () => {
  session.breaker = { state: "closed", consecutiveFailures: 0, openUntil: 0 };
  renderBreaker();
});
elements.featureEnabled.addEventListener("change", () => {
  elements.activityLive.textContent = elements.featureEnabled.checked
    ? "Feature Flag ativada. A integraÃ§Ã£o pode receber eventos."
    : "Feature Flag desativada. Novos eventos serÃ£o ignorados.";
});
elements.runButton.addEventListener("click", runSimulation);
elements.resetButton.addEventListener("click", resetSession);

updateRangeDisplays();
render();

