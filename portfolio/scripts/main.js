/* ==========================================================================
   GUILHERME DAMASCENO // CYBERPUNK TACTICAL HUD ENGINE (v2.0)
   Pure Vanilla JS · Zero Dependencies · Accessible & Motion-Aware
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------------------
     1. Preferences & State
     ------------------------------------------------------------------------ */
  const STORAGE_KEYS = {
    audio: "portfolio-audio-preference",
    glitch: "portfolio-glitch-mode",
    theme: "portfolio-hud-theme",
    boot: "portfolio-boot-seen",
  };

  const THEMES = [
    { id: "cyber", label: "CYBER // YELLOW" },
    { id: "netrunner", label: "NETRUNNER // CYAN" },
    { id: "arasaka", label: "ARASAKA // CRIMSON" },
  ];

  let savedAudioPreference = "off";
  let glitchEnabled = true;
  let currentThemeIndex = 0;
  let audioCtx = null;

  const safeGetStorage = (storage, key) => {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeSetStorage = (storage, key, value) => {
    try {
      storage.setItem(key, value);
    } catch {
      /* Storage blocked or private mode */
    }
  };

  const storedAudio = safeGetStorage(window.localStorage, STORAGE_KEYS.audio);
  if (storedAudio === "on" || storedAudio === "off") {
    savedAudioPreference = storedAudio;
  }

  glitchEnabled = safeGetStorage(window.localStorage, STORAGE_KEYS.glitch) !== "off";

  const storedTheme = safeGetStorage(window.localStorage, STORAGE_KEYS.theme);
  const foundThemeIdx = THEMES.findIndex((item) => item.id === storedTheme);
  if (foundThemeIdx >= 0) {
    currentThemeIndex = foundThemeIdx;
  }

  /* ------------------------------------------------------------------------
     2. Subtle Web Audio UI Synthesizer (Active only when SOM ON)
     ------------------------------------------------------------------------ */
  const ambientAudio = document.querySelector("#background-audio");
  const audioToggle = document.querySelector("#audio-toggle");
  const audioLabel = audioToggle?.querySelector(".audio-label");
  const audioStatus = document.querySelector("#audio-status");

  function playUiTick(freq = 880, duration = 0.022) {
    if (!ambientAudio || ambientAudio.paused || motionPreference.matches) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      /* Ignore Web Audio errors */
    }
  }

  /* ------------------------------------------------------------------------
     3. Ambient Soundtrack Controller
     ------------------------------------------------------------------------ */
  function saveAudioPreference(preference) {
    savedAudioPreference = preference;
    safeSetStorage(window.localStorage, STORAGE_KEYS.audio, preference);
  }

  function updateAudioState(isPlaying, status) {
    if (!audioToggle) return;
    audioToggle.setAttribute("aria-pressed", String(isPlaying));
    audioToggle.setAttribute(
      "aria-label",
      isPlaying
        ? "Pausar música Lonerism"
        : "Ativar música Lonerism, de Alejandro Magaña, em volume baixo"
    );
    if (audioLabel) audioLabel.textContent = isPlaying ? "SOM ON" : "SOM OFF";
    if (audioStatus) audioStatus.textContent = status;
  }

  async function startAmbientAudio() {
    if (!ambientAudio) return false;
    try {
      await ambientAudio.play();
      updateAudioState(true, "LONERISM · TRILHA ATIVA · VOLUME 20%");
      playUiTick(1040, 0.035);
      return true;
    } catch {
      updateAudioState(false, "ÁUDIO INDISPONÍVEL");
      return false;
    }
  }

  function pauseAmbientAudio(reason = "TRILHA PAUSADA") {
    if (!ambientAudio) return;
    ambientAudio.pause();
    updateAudioState(false, reason);
  }

  if (ambientAudio && audioToggle) {
    ambientAudio.src = "./assets/audio/mixkit-lonerism-159.mp3";
    ambientAudio.volume = 0.2;
    audioToggle.disabled = false;
    if (audioStatus) {
      audioStatus.textContent =
        savedAudioPreference === "on"
          ? "PREFERÊNCIA SALVA · CLIQUE PARA ATIVAR"
          : "LONERISM · ALEJANDRO MAGAÑA";
    }

    audioToggle.addEventListener("click", async () => {
      if (ambientAudio.paused) {
        saveAudioPreference("on");
        await startAmbientAudio();
        return;
      }
      saveAudioPreference("off");
      pauseAmbientAudio("TRILHA PAUSADA");
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && !ambientAudio.paused) {
        pauseAmbientAudio("TRILHA PAUSADA AO TROCAR DE ABA");
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. Theme Overclock & Glitch Mode Controls
     ------------------------------------------------------------------------ */
  const glitchToggle = document.querySelector("#glitch-toggle");
  const themeToggle = document.querySelector("#theme-toggle");

  function applyTheme(index) {
    currentThemeIndex = ((index % THEMES.length) + THEMES.length) % THEMES.length;
    const theme = THEMES[currentThemeIndex];
    if (theme.id === "cyber") {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = theme.id;
    }
    if (themeToggle) {
      const span = themeToggle.querySelector("span");
      if (span) span.textContent = theme.label;
    }
    safeSetStorage(window.localStorage, STORAGE_KEYS.theme, theme.id);
    playUiTick(960, 0.025);
  }

  function renderGlitchPreference() {
    const disableEffects = !glitchEnabled || motionPreference.matches;
    root.classList.toggle("glitch-off", disableEffects);
    if (glitchToggle) {
      glitchToggle.setAttribute("aria-pressed", String(glitchEnabled));
      const span = glitchToggle.querySelector("span");
      if (span) span.textContent = glitchEnabled ? "ON" : "OFF";
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => applyTheme(currentThemeIndex + 1));
  }
  applyTheme(currentThemeIndex);

  if (glitchToggle) {
    glitchToggle.addEventListener("click", () => {
      glitchEnabled = !glitchEnabled;
      renderGlitchPreference();
      safeSetStorage(window.localStorage, STORAGE_KEYS.glitch, glitchEnabled ? "on" : "off");
      playUiTick(740, 0.025);
    });
  }
  motionPreference.addEventListener?.("change", renderGlitchPreference);
  renderGlitchPreference();

  /* ------------------------------------------------------------------------
     5. Navigation, Scroll Laser & Telemetry Clock
     ------------------------------------------------------------------------ */
  const yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const menuButton = document.querySelector("#menu-toggle");
  const menu = document.querySelector("#menu-principal");

  function closeMenu() {
    if (!menuButton || !menu) return;
    menuButton.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menu.classList.toggle("is-open", !isOpen);
    });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  }

  const scrollLaserBar = document.querySelector("#scroll-laser-bar");
  const scrollReadout = document.querySelector("#telemetry-scroll");
  let scrollTicking = false;

  function updateScrollProgress() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    if (scrollLaserBar) {
      scrollLaserBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    }
    if (scrollReadout) {
      const pct = String(Math.round(ratio * 100)).padStart(3, "0");
      scrollReadout.textContent = `DEPTH // ${pct}%`;
    }
    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateScrollProgress);
        scrollTicking = true;
      }
    },
    { passive: true }
  );
  updateScrollProgress();

  const clockEl = document.querySelector("#telemetry-clock");
  function updateTelemetryClock() {
    if (!clockEl) return;
    try {
      const time = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
      clockEl.textContent = `BRT // ${time}`;
    } catch {
      clockEl.textContent = "BRT // ONLINE";
    }
  }
  updateTelemetryClock();
  window.setInterval(updateTelemetryClock, 1000);

  /* ------------------------------------------------------------------------
     6. Cipher Scramble & Periodic Hero Glitch
     ------------------------------------------------------------------------ */
  const CIPHER_CHARS = "01ABCDEF#/_<>[]{}ΔΣΩ";

  function scrambleElement(el) {
    if (!el || !glitchEnabled || motionPreference.matches) return;
    const original = el.dataset.originalText || el.textContent;
    el.dataset.originalText = original;
    let iteration = 0;
    const step = Math.max(0.6, original.length / 14);

    window.clearInterval(el._scrambleTimer);
    el._scrambleTimer = window.setInterval(() => {
      el.textContent = original
        .split("")
        .map((ch, idx) => {
          if (ch === " " || ch === "\n") return ch;
          if (idx < iteration) return original[idx];
          return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
        })
        .join("");

      iteration += step;
      if (iteration >= original.length) {
        el.textContent = original;
        window.clearInterval(el._scrambleTimer);
      }
    }, 26);
  }

  const heroTitle = document.querySelector(".hero h1");
  if (heroTitle) {
    window.setInterval(() => {
      if (!glitchEnabled || motionPreference.matches || document.hidden) return;
      heroTitle.classList.add("is-glitching");
      window.setTimeout(() => heroTitle.classList.remove("is-glitching"), 240);
    }, 6400);
  }

  /* ------------------------------------------------------------------------
     7. Section Observer & Scroll Reveal
     ------------------------------------------------------------------------ */
  const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const observedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const activeSectorEl = document.querySelector("#telemetry-sector");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach((link) => {
            const match = link.getAttribute("href") === `#${entry.target.id}`;
            if (match) {
              link.setAttribute("aria-current", "location");
              if (activeSectorEl) {
                activeSectorEl.textContent = `SECTOR // ${entry.target.id.toUpperCase()}`;
              }
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    observedSections.forEach((section) => sectionObserver.observe(section));

    if (!motionPreference.matches) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible", "glitch-in");
            const codeBadge = entry.target.querySelector?.("[data-scramble]");
            if (codeBadge) scrambleElement(codeBadge);
            if (entry.target.hasAttribute("data-scramble")) scrambleElement(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12 }
      );
      document
        .querySelectorAll(".reveal, .glitch-title, [data-scramble]")
        .forEach((element) => revealObserver.observe(element));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    }
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------------------
     8. 3D Holographic ID Card & Pointer Spotlight Cards
     ------------------------------------------------------------------------ */
  const idCard = document.querySelector(".id-card");
  if (idCard && window.matchMedia("(pointer: fine)").matches) {
    idCard.addEventListener("pointermove", (event) => {
      if (!glitchEnabled || motionPreference.matches) return;
      const rect = idCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 9;
      const rotateX = (0.5 - y) * 9;
      idCard.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
      idCard.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
      idCard.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      idCard.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    });

    idCard.addEventListener("pointerleave", () => {
      idCard.style.setProperty("--rx", "0deg");
      idCard.style.setProperty("--ry", "0deg");
    });
  }

  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".spotlight-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${(event.clientX - rect.left).toFixed(0)}px`);
        card.style.setProperty("--my", `${(event.clientY - rect.top).toFixed(0)}px`);
      });
    });
  }

  /* ------------------------------------------------------------------------
     9. Dynamic Cycling Terminal Stack in Hero
     ------------------------------------------------------------------------ */
  const terminalTyped = document.querySelector("#typed-stack");
  const STACK_ROTATION = [
    "Java 17 · Spring Boot · C# · .NET · n8n",
    "Python · FastAPI · LangGraph · AWS Bedrock",
    "Docker · Kubernetes · ArgoCD · Datadog APM",
    "PostgreSQL · NHibernate · APIs Resilientes",
  ];

  if (terminalTyped && !motionPreference.matches) {
    let lineIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const tickTerminal = () => {
      const currentLine = STACK_ROTATION[lineIdx];
      if (!deleting) {
        charIdx += 1;
        terminalTyped.textContent = currentLine.slice(0, charIdx);
        if (charIdx >= currentLine.length) {
          deleting = true;
          window.setTimeout(tickTerminal, 2800);
          return;
        }
        window.setTimeout(tickTerminal, 24);
      } else {
        charIdx -= 2;
        terminalTyped.textContent = currentLine.slice(0, Math.max(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          lineIdx = (lineIdx + 1) % STACK_ROTATION.length;
          window.setTimeout(tickTerminal, 240);
          return;
        }
        window.setTimeout(tickTerminal, 14);
      }
    };

    terminalTyped.textContent = "";
    tickTerminal();
  }

  /* ------------------------------------------------------------------------
     10. Interactive Architecture Blueprint (Mission 01)
     ------------------------------------------------------------------------ */
  const archNodes = [...document.querySelectorAll(".arch-node")];
  const missionPoints = [...document.querySelectorAll("#mission-01-points li")];

  function highlightArchStage(stage) {
    archNodes.forEach((node) => {
      const active = node.dataset.stage === stage;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", String(active));
    });
    missionPoints.forEach((point) => {
      const stages = (point.dataset.stage || "").split(",");
      point.classList.toggle("is-highlighted", Boolean(stage) && stages.includes(stage));
    });
  }

  archNodes.forEach((node) => {
    node.addEventListener("mouseenter", () => highlightArchStage(node.dataset.stage));
    node.addEventListener("mouseleave", () => highlightArchStage(""));
    node.addEventListener("click", () => {
      const alreadyActive = node.classList.contains("is-active");
      highlightArchStage(alreadyActive ? "" : node.dataset.stage);
      playUiTick(920, 0.02);
    });
  });

  /* ------------------------------------------------------------------------
     11. Cross-Dossier Skill Trace Highlighting
     ------------------------------------------------------------------------ */
  const skillChips = [...document.querySelectorAll("[data-skill]")];
  const traceBar = document.querySelector("#skill-trace-bar");
  const traceText = document.querySelector("#skill-trace-text");
  const traceClear = document.querySelector("#skill-trace-clear");
  let activeSkill = "";

  function setSkillTrace(skillKey, labelText = "") {
    activeSkill = activeSkill === skillKey ? "" : skillKey;
    let count = 0;

    skillChips.forEach((chip) => {
      const keys = chip.dataset.skill.split(",");
      const match = Boolean(activeSkill) && keys.includes(activeSkill);
      chip.classList.toggle("is-skill-match", match);
      if (match) count += 1;
    });

    if (traceBar && traceText) {
      if (activeSkill) {
        traceBar.hidden = false;
        traceText.textContent = `RASTREAMENTO DE TECNOLOGIA // ${(labelText || activeSkill).toUpperCase()} · ${count} OCORRÊNCIAS NO DOSSIÊ`;
      } else {
        traceBar.hidden = true;
      }
    }
    playUiTick(840, 0.02);
  }

  skillChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const primaryKey = chip.dataset.skill.split(",")[0];
      setSkillTrace(primaryKey, chip.textContent.trim());
    });
  });

  if (traceClear) {
    traceClear.addEventListener("click", () => setSkillTrace(""));
  }

  /* ------------------------------------------------------------------------
     12. Project Contracts Filtering & Live Counts
     ------------------------------------------------------------------------ */
  const filters = [...document.querySelectorAll(".filter-button")];
  const projectCards = [...document.querySelectorAll("#project-grid .project-card")];
  const filterStatus = document.querySelector("#filter-status");

  // Populate accurate badge counts on each filter button
  filters.forEach((button) => {
    const filter = button.dataset.filter;
    const count =
      filter === "all"
        ? projectCards.length
        : projectCards.filter((card) => card.dataset.tech.split(",").includes(filter)).length;
    const badge = button.querySelector(".filter-count");
    if (badge) badge.textContent = `[${String(count).padStart(2, "0")}]`;
  });

  function applyProjectFilter(filterValue) {
    let visibleCount = 0;
    filters.forEach((item) => {
      const active = item.dataset.filter === filterValue;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    projectCards.forEach((card) => {
      const visible =
        filterValue === "all" || card.dataset.tech.split(",").includes(filterValue);
      card.hidden = !visible;
      card.classList.remove("is-filtering-in");
      if (visible) {
        visibleCount += 1;
        if (!motionPreference.matches && glitchEnabled) {
          void card.offsetWidth;
          card.classList.add("is-filtering-in");
        }
      }
    });

    if (filterStatus) {
      filterStatus.textContent = `${visibleCount} ${
        visibleCount === 1 ? "contrato exibido" : "contratos exibidos"
      }`;
    }
    playUiTick(780, 0.02);
    return visibleCount;
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => applyProjectFilter(button.dataset.filter));
  });

  /* ------------------------------------------------------------------------
     13. Copy Email Action
     ------------------------------------------------------------------------ */
  const copyButton = document.querySelector("#copy-email");
  const emailAddressEl = document.querySelector("#email-address");
  const copyFeedback = document.querySelector("#copy-feedback");

  async function copyEmailToClipboard() {
    if (!emailAddressEl) return false;
    const email = emailAddressEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      if (copyFeedback) copyFeedback.textContent = "✓ CANAL COPIADO PARA A ÁREA DE TRANSFERÊNCIA";
      playUiTick(1120, 0.03);
      return true;
    } catch {
      if (copyFeedback) copyFeedback.textContent = `CÓPIA MANUAL · ${email}`;
      return false;
    }
  }

  if (copyButton) {
    copyButton.addEventListener("click", copyEmailToClipboard);
  }

  /* ------------------------------------------------------------------------
     14. Interactive Netrunner Command Terminal (Ctrl+K / /)
     ------------------------------------------------------------------------ */
  const cmdBackdrop = document.querySelector("#cmd-backdrop");
  const cmdOutput = document.querySelector("#cmd-output");
  const cmdForm = document.querySelector("#cmd-form");
  const cmdInput = document.querySelector("#cmd-input");
  const cmdClose = document.querySelector("#cmd-close");
  const cmdTriggers = [...document.querySelectorAll("[data-open-cmd]")];
  const cmdChips = [...document.querySelectorAll("[data-cmd]")];

  const cmdHistory = [];
  let historyPointer = -1;
  let lastFocusedBeforeCmd = null;

  const AVAILABLE_COMMANDS = [
    "help",
    "whoami",
    "missions",
    "stack",
    "projects",
    "theme",
    "audio",
    "glitch",
    "cv",
    "email",
    "linkedin",
    "github",
    "clear",
    "exit",
  ];

  function appendCmdLine(text, variant = "sys") {
    if (!cmdOutput) return;
    const p = document.createElement("p");
    p.className = `cmd-line cmd-line-${variant}`;
    p.textContent = text;
    cmdOutput.append(p);
    cmdOutput.scrollTop = cmdOutput.scrollHeight;
  }

  function openCmdModal() {
    if (!cmdBackdrop) return;
    lastFocusedBeforeCmd = document.activeElement;
    cmdBackdrop.hidden = false;
    closeMenu();
    window.setTimeout(() => cmdInput?.focus(), 20);
    playUiTick(980, 0.025);
  }

  function closeCmdModal() {
    if (!cmdBackdrop || cmdBackdrop.hidden) return;
    cmdBackdrop.hidden = true;
    if (lastFocusedBeforeCmd && typeof lastFocusedBeforeCmd.focus === "function") {
      lastFocusedBeforeCmd.focus();
    }
  }

  async function executeCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    appendCmdLine(`gd@netrunner:~$ ${trimmed}`, "user");
    const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/);
    const arg = args[0] || "";

    switch (cmd) {
      case "help":
        appendCmdLine(
          [
            "COMANDOS DISPONÍVEIS:",
            "  whoami              → Resumo do operador e vínculo atual",
            "  missions            → Log das missões (RD Saúde, Leroy Merlin, Automação)",
            "  stack               → Loadout técnico principal",
            "  projects [filtro]   → Navega/filtra contratos (ex: projects python)",
            "  theme [nome]        → Alterna HUD (cyber | netrunner | arasaka)",
            "  audio [on|off]      → Liga/desliga trilha Synthwave",
            "  glitch [on|off]     → Alterna efeitos visuais CRT/glitch",
            "  email               → Copia o e-mail profissional",
            "  cv                  → Baixa o currículo em PDF",
            "  linkedin / github   → Abre redes profissionais",
            "  clear / exit        → Limpa ou fecha o terminal",
          ].join("\n"),
          "sys"
        );
        break;

      case "whoami":
        appendCmdLine(
          "GUILHERME DAMASCENO OLIVEIRA // Desenvolvedor Full Stack na Develcode.\nAtuação em squads da RD Saúde e Leroy Merlin · ADS (UNISO) & Eng. de Software (Estácio).",
          "accent"
        );
        break;

      case "missions":
        appendCmdLine(
          [
            "[MISSION_01] RD SAÚDE · Agentes de IA resilientes (Java 17, Spring Boot, FastAPI, LangGraph, AWS Bedrock, Langfuse)",
            "[MISSION_02] LEROY MERLIN · Modernização de sistemas legados (C#, .NET, ActiveRecord/NHibernate, PostgreSQL)",
            "[MISSION_03] TRANSVERSAL · Automação de processos e integrações (n8n, Python, JS, IA)",
          ].join("\n"),
          "sys"
        );
        document.querySelector("#experiencia")?.scrollIntoView({ behavior: "smooth" });
        break;

      case "stack":
        appendCmdLine(
          "CORE: Java 17 · Spring Boot · C# · .NET · Python · FastAPI\nIA & OPS: LangChain · LangGraph · AWS Bedrock · Langfuse · Docker · K8s · ArgoCD · Datadog\nDATA & WEB: PostgreSQL · MySQL · MongoDB · React · TypeScript · n8n",
          "accent"
        );
        document.querySelector("#competencias")?.scrollIntoView({ behavior: "smooth" });
        break;

      case "projects": {
        const validFilters = filters.map((f) => f.dataset.filter);
        const target = arg && validFilters.includes(arg) ? arg : "all";
        const count = applyProjectFilter(target);
        appendCmdLine(
          `FILTRO DE CONTRATOS ATIVO: [${target.toUpperCase()}] → ${count} projeto(s).`,
          "accent"
        );
        document.querySelector("#projetos")?.scrollIntoView({ behavior: "smooth" });
        break;
      }

      case "theme":
      case "overclock": {
        if (arg) {
          const idx = THEMES.findIndex((t) => t.id === arg);
          if (idx >= 0) {
            applyTheme(idx);
          } else {
            appendCmdLine("Paletas válidas: cyber, netrunner, arasaka", "sys");
            break;
          }
        } else {
          applyTheme(currentThemeIndex + 1);
        }
        appendCmdLine(`HUD PALETTE → ${THEMES[currentThemeIndex].label}`, "accent");
        break;
      }

      case "audio": {
        if (arg === "on" || (!arg && ambientAudio?.paused)) {
          saveAudioPreference("on");
          const ok = await startAmbientAudio();
          appendCmdLine(ok ? "TRILHA ATIVADA (VOLUME 20%)" : "ÁUDIO INDISPONÍVEL", "accent");
        } else {
          saveAudioPreference("off");
          pauseAmbientAudio("TRILHA PAUSADA VIA TERMINAL");
          appendCmdLine("TRILHA PAUSADA.", "sys");
        }
        break;
      }

      case "glitch": {
        if (arg === "on") glitchEnabled = true;
        else if (arg === "off") glitchEnabled = false;
        else glitchEnabled = !glitchEnabled;
        renderGlitchPreference();
        safeSetStorage(window.localStorage, STORAGE_KEYS.glitch, glitchEnabled ? "on" : "off");
        appendCmdLine(`MODO GLITCH: ${glitchEnabled ? "ON" : "OFF"}`, "accent");
        break;
      }

      case "email": {
        const copied = await copyEmailToClipboard();
        appendCmdLine(
          copied
            ? "E-mail copiado: guilhermedamascenooliveira@gmail.com"
            : "E-mail: guilhermedamascenooliveira@gmail.com",
          "accent"
        );
        break;
      }

      case "cv": {
        appendCmdLine("Iniciando download de CV_Guilherme_Damasceno.pdf...", "accent");
        const link = document.createElement("a");
        link.href = "./CV_Guilherme_Damasceno.pdf";
        link.download = "CV_Guilherme_Damasceno.pdf";
        document.body.append(link);
        link.click();
        link.remove();
        break;
      }

      case "linkedin":
        window.open(
          "https://www.linkedin.com/in/guilherme-damasceno-oliveira-a308b226a/",
          "_blank",
          "noopener,noreferrer"
        );
        appendCmdLine("Abrindo LinkedIn em nova aba...", "accent");
        break;

      case "github":
        window.open("https://github.com/Guilhermedms7", "_blank", "noopener,noreferrer");
        appendCmdLine("Abrindo GitHub em nova aba...", "accent");
        break;

      case "clear":
        if (cmdOutput) cmdOutput.innerHTML = "";
        break;

      case "exit":
      case "close":
        closeCmdModal();
        break;

      default:
        appendCmdLine(
          `Comando não reconhecido: "${cmd}". Digite "help" para listar os comandos.`,
          "sys"
        );
    }
  }

  cmdTriggers.forEach((btn) => btn.addEventListener("click", openCmdModal));
  cmdClose?.addEventListener("click", closeCmdModal);
  cmdBackdrop?.addEventListener("click", (event) => {
    if (event.target === cmdBackdrop) closeCmdModal();
  });

  cmdChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      executeCommand(chip.dataset.cmd);
      cmdInput?.focus();
    });
  });

  cmdForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cmdInput) return;
    const value = cmdInput.value;
    if (value.trim()) {
      cmdHistory.unshift(value);
      historyPointer = -1;
    }
    cmdInput.value = "";
    executeCommand(value);
  });

  cmdInput?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyPointer + 1 < cmdHistory.length) {
        historyPointer += 1;
        cmdInput.value = cmdHistory[historyPointer];
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyPointer > 0) {
        historyPointer -= 1;
        cmdInput.value = cmdHistory[historyPointer];
      } else {
        historyPointer = -1;
        cmdInput.value = "";
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      const partial = cmdInput.value.trim().toLowerCase();
      if (!partial) return;
      const match = AVAILABLE_COMMANDS.find((item) => item.startsWith(partial));
      if (match) cmdInput.value = match;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeCmdModal();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (cmdBackdrop?.hidden) openCmdModal();
      else closeCmdModal();
      return;
    }
    const tag = document.activeElement?.tagName;
    if (
      event.key === "/" &&
      !event.ctrlKey &&
      !event.metaKey &&
      tag !== "INPUT" &&
      tag !== "TEXTAREA" &&
      cmdBackdrop?.hidden
    ) {
      event.preventDefault();
      openCmdModal();
    }
  });

  /* ------------------------------------------------------------------------
     15. Tactical Boot Sequence (With Pause-on-Interaction Fix)
     ------------------------------------------------------------------------ */
  function startBootSequence() {
    if (motionPreference.matches) return;
    if (safeGetStorage(window.sessionStorage, STORAGE_KEYS.boot) === "yes") return;
    safeSetStorage(window.sessionStorage, STORAGE_KEYS.boot, "yes");

    const boot = document.createElement("div");
    boot.className = "boot-screen";
    boot.setAttribute("role", "dialog");
    boot.setAttribute("aria-modal", "true");
    boot.setAttribute("aria-labelledby", "boot-title");
    boot.innerHTML = `
      <div class="boot-inner">
        <span class="mono">INITIALIZING TACTICAL DOSSIER // GD-01</span>
        <strong id="boot-title">IDENTITY<br />VERIFIED<span>.</span></strong>
        <div class="boot-logs mono" aria-hidden="true">
          <span>[<b>OK</b>] MOUNTING BACK-END &amp; AI ORCHESTRATION MODULES</span>
          <span>[<b>OK</b>] LOADING SQUAD LOGS: RD SAÚDE · LEROY MERLIN</span>
          <span>[<b>OK</b>] SYNTHWAVE AUDIO ENGINE READY (20% GAIN)</span>
        </div>
        <span class="boot-progress" aria-hidden="true"><i></i></span>
        <p class="boot-prompt mono">SELECIONE O MODO DE ENTRADA</p>
        <div class="boot-actions">
          <button class="boot-action boot-action-primary mono" type="button">ENTRAR COM SOM ♫</button>
          <button class="boot-action mono" type="button">MODO SILENCIOSO</button>
        </div>
        <button class="boot-skip mono" type="button">PULAR ABERTURA [ESC]</button>
      </div>
    `;
    document.body.append(boot);

    let remainingMs = 4500;
    let lastTick = performance.now();
    let paused = false;
    let rafId = 0;

    const finishBoot = () => {
      window.cancelAnimationFrame(rafId);
      boot.classList.add("is-finished");
      window.removeEventListener("keydown", onBootKey);
      if (boot.contains(document.activeElement)) audioToggle?.focus();
      window.setTimeout(() => boot.remove(), 260);
    };

    const tickBootTimer = (now) => {
      if (!paused) {
        remainingMs -= now - lastTick;
        if (remainingMs <= 0) {
          finishBoot();
          return;
        }
      }
      lastTick = now;
      rafId = window.requestAnimationFrame(tickBootTimer);
    };

    const inner = boot.querySelector(".boot-inner");
    inner?.addEventListener("pointerenter", () => {
      paused = true;
    });
    inner?.addEventListener("pointerleave", () => {
      paused = false;
      lastTick = performance.now();
    });

    const onBootKey = (event) => {
      if (event.key === "Escape") {
        saveAudioPreference("off");
        finishBoot();
      }
    };

    const [soundButton, silentButton] = boot.querySelectorAll(".boot-action");
    soundButton.addEventListener("click", () => {
      saveAudioPreference("on");
      finishBoot();
      startAmbientAudio();
    });
    silentButton.addEventListener("click", () => {
      saveAudioPreference("off");
      finishBoot();
    });
    boot.querySelector(".boot-skip").addEventListener("click", () => {
      saveAudioPreference("off");
      finishBoot();
    });

    window.addEventListener("keydown", onBootKey);
    soundButton.focus();
    rafId = window.requestAnimationFrame(tickBootTimer);
  }

  startBootSequence();
})();
