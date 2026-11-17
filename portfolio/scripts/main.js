/* ==========================================================================
   GUILHERME DAMASCENO // CYBERPUNK TACTICAL HUD ENGINE (v2.1)
   Pure Vanilla JS · Bilingual (PT-BR / EN) · Accessible & Motion-Aware
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------------------
     1. Preferences, State & Bilingual Dictionary
     ------------------------------------------------------------------------ */
  const STORAGE_KEYS = {
    audio: "portfolio-audio-preference",
    glitch: "portfolio-glitch-mode",
    theme: "portfolio-hud-theme",
    lang: "portfolio-hud-lang",
    boot: "portfolio-boot-seen",
  };

  const THEMES = [
    { id: "cyber", label: "CYBER // YELLOW" },
    { id: "netrunner", label: "NETRUNNER // CYAN" },
    { id: "arasaka", label: "ARASAKA // CRIMSON" },
  ];

  const I18N = {
    pt: {
      pageTitle: "Guilherme Damasceno | Desenvolvedor Full Stack",
      skip: "Pular para o conteúdo",
      "nav.about": "Dossiê",
      "nav.missions": "Missões",
      "nav.loadout": "Loadout",
      "nav.projects": "Contratos",
      "nav.training": "Treinamento",
      "nav.contact": 'Contato <span aria-hidden="true">↗</span>',
      "hero.eyebrow":
        '<span class="status-light" aria-hidden="true"></span> Perfil ativo <span class="eyebrow-divider">/</span> Desenvolvedor Full Stack',
      "hero.desc": "Back-end resiliente, integrações e agentes de IA para sistemas corporativos.",
      "hero.context":
        "Atuo na Develcode em squads da RD Saúde e da Leroy Merlin, conectando sistemas, modernizando aplicações e automatizando processos.",
      "hero.ctaPrimary": 'Explorar missões <span aria-hidden="true">↘</span>',
      "hero.ctaCv": 'Currículo PDF <span aria-hidden="true">↓</span>',
      "hero.bottomHint":
        'PRESSIONE <b>CTRL+K</b> OU ROLE PARA EXPLORAR <b aria-hidden="true">↓</b>',
      "card.role": "OPERADOR // FULL STACK",
      "card.companyLabel": "VÍNCULO",
      "card.squadsLabel": "ATUAÇÃO",
      "card.stackValue": "Java / Spring · C# / .NET · IA",
      "about.code": "SEC_01 // PERFIL",
      "about.eyebrow": "Dossiê",
      "about.title": "Eu conecto<br /><em>sistemas.</em>",
      "about.lead":
        "Desenvolvo sistemas corporativos, APIs e integrações. Na Develcode, atuo em squads da RD Saúde e da Leroy Merlin com back-end, modernização e automação.",
      "about.body":
        "Trabalho principalmente com Java e Spring Boot, C# e .NET. Também crio fluxos com n8n e uso Python e JavaScript para apoiar integrações, orquestrar agentes de IA e reduzir tarefas manuais.",
      "about.f1Label": "01 / EMPRESA",
      "about.f1Sub": "Desenvolvedor Full Stack",
      "about.f2Label": "02 / FORMAÇÃO",
      "about.f2Sub": "Engenharia de Software · Estácio",
      "about.f3Label": "03 / FOCO",
      "about.f3Title": "Back-end & IA",
      "about.f3Sub": "Resiliência · integração · automação",
      "missions.code": "SEC_02 // EXPERIÊNCIA",
      "missions.eyebrow": "Log de missões",
      "missions.title": "Trabalho em campo",
      "missions.aside": "DEZ/2025 — ATUAL<br />SQUADS / DEVELCODE",
      "missions.dtContext": "CONTEXTO",
      "missions.dtActions": "O QUE FIZ",
      "missions.dtResult": "RESULTADO",
      "missions.stackHint": "STACK (CLIQUE PARA RASTREAR NO DOSSIÊ)",
      "m1.title": "Agentes de IA<br />resilientes",
      "m1.context":
        "Plataforma corporativa usa IA para gerar e validar histórias de usuário e calcular pontuação.",
      "m1.p1":
        "Valido campos obrigatórios com Java 17 e Spring Boot: explico falhas, bloqueio cards e aplico feature flag com fail-closed.",
      "m1.p2":
        "Integro Python (FastAPI, LangChain/LangGraph) ao gateway corporativo de LLM (AWS Bedrock), com correlation ID, timeouts configuráveis, erros HTTP controlados, Langfuse e mascaramento de dados.",
      "m1.p3":
        "Reforço o agente com retries para throttling, schemas tolerantes e validação 1:1 dos itens.",
      "m1.p4":
        "Amplio testes; corrijo vulnerabilidades de dependências (SCA/SAST) e mitigo XSS e Log Injection.",
      "m1.p5":
        "Apoio CI/CD, releases e resolução de conflitos com Docker, Kubernetes, ArgoCD e Datadog APM.",
      "m1.result":
        "Eliminei a perda de critérios de aceite na análise e reforcei validação e resiliência.",
      "m1.archHint": "PIPELINE OPERACIONAL // PASSE O MOUSE OU CLIQUE PARA INSPECIONAR",
      "m1.archCount": "4 ESTÁGIOS",
      "m1.node2Title": "Agente IA",
      "m1.node2Sub": "FastAPI · LangGraph · Validação 1:1",
      "m2.title": "Modernização<br />de sistemas",
      "m2.context": "Manutenção e modernização de sistemas legados.",
      "m2.actions":
        "Refatoro sistemas legados com C# e .NET, aplico padrões de projeto, modelo a persistência com ActiveRecord/NHibernate e PostgreSQL e diagnostico problemas de integridade de dados e regras de negócio.",
      "m2.result":
        "Refatorações direcionadas e problemas de dados e negócio investigados no contexto do sistema legado.",
      "m3.cat": "TRANSVERSAL · AUTOMAÇÃO",
      "m3.title": "Menos rotina.<br />Mais fluxo.",
      "m3.context": "Tarefas manuais e fluxos entre serviços.",
      "m3.actions":
        "Crio automações e integrações com n8n, Python, JavaScript e recursos de IA.",
      "m3.result": "Reduzo tarefas manuais e apoio a eficiência operacional.",
      "loadout.code": "SEC_03 // SISTEMAS",
      "loadout.title": "Ferramentas<br />de trabalho",
      "loadout.aside":
        "Sem métricas inventadas.<br />Clique em uma tecnologia para rastrear seu uso.",
      "loadout.clearTrace": "LIMPAR [×]",
      "loadout.s2": "Arquitetura & qualidade",
      "loadout.s3": "IA & agentes",
      "loadout.s4": "Cloud & observabilidade",
      "loadout.s6": "Dados & persistência",
      "loadout.s7": "DevOps & automação",
      "loadout.s8": "Base complementar",
      "loadout.traits":
        "<b>TRAÇOS // </b>Colaboração · comunicação · organização · aprendizado rápido · resolução de problemas",
      "loadout.lang": "<b>IDIOMA // </b>Inglês intermediário",
      "chip.assistiveAi": "IA assistiva",
      "chip.ruleVal": "Validação de regras",
      "chip.tests": "Testes",
      "chip.automation": "Automação",
      "chip.relDb": "Banco de dados relacionais",
      "chip.reqEng": "Engenharia de requisitos",
      "chip.ds": "Estruturas de dados",
      "chip.logic": "Raciocínio lógico",
      "chip.sysSec": "Segurança de sistemas",
      "chip.bizRules": "Regras de negócio",
      "projects.code": "SEC_04 // PROJETOS",
      "projects.eyebrow": "Contratos",
      "projects.title": "Trabalhos em destaque",
      "projects.aside": "Pessoais · acadêmicos · demonstrações",
      "projects.filterLabel": "FILTRAR POR TECNOLOGIA",
      "projects.filterAll": "Todos",
      "projects.openSite": 'Abrir site <span aria-hidden="true">↗</span>',
      "projects.viewRepo": 'Ver repositório <span aria-hidden="true">↗</span>',
      "p1.cat": "APRENDIZADO DE IDIOMAS · WEB APP",
      "p1.desc":
        "Pratico leitura em inglês com histórias, filtros por categoria e nível CEFR e exercícios de completar lacunas.",
      "p2.desc":
        "Criei uma loja de tecnologia com catálogo, busca, ofertas e carrinho, conectada a uma API e banco de dados.",
      "p3.cat": "APLICAÇÃO FULL STACK",
      "p3.desc":
        "Desenvolvi um sistema para gerenciar livros e usuários com cadastro, consulta, edição e remoção.",
      "p4.cat": "APLICATIVO MOBILE",
      "p4.desc":
        "Criei um aplicativo de delivery com cadastro, categorias de produtos, carrinho e modo escuro.",
      "p5.cat": "SISTEMA ACADÊMICO",
      "p5.title": "Sistema Bancário",
      "p5.desc":
        "Implementei cadastro de clientes, agências e contas, consulta de saldo, extrato e movimentações.",
      "p6.cat": "JOGO WEB",
      "p6.desc":
        "Desenvolvi um jogo de palavras no navegador com os modos Termo, Dueto e Quarteto.",
      "p7.cat": "PROJETO ACADÊMICO · E-COMMERCE",
      "p7.desc":
        "Criei um projeto inspirado na Terabyte, com cadastro de produtos, carrinho e painel de estoque.",
      "p8.cat": "PROJETO ACADÊMICO · UI/UX",
      "p8.title": "Aplicativo fitness",
      "p8.desc":
        "Desenhei telas de login, cadastro, perfil e acompanhamento de treinos com foco em usabilidade e responsividade.",
      "p8.note": "PROTÓTIPO · SEM LINK PÚBLICO",
      "training.code": "SEC_05 // FORMAÇÃO",
      "training.eyebrow": "Treinamento",
      "training.title": "Base em<br /><em>construção.</em>",
      "training.deg1": "Análise e Desenvolvimento de Sistemas",
      "training.done": "CONCLUÍDO",
      "training.date2": "2025 — ATUAL",
      "training.deg2": "Engenharia de Software",
      "training.current": "CURSANDO",
      "training.coursesHeader": "TREINAMENTO COMPLEMENTAR / 06 REGISTROS",
      "contact.code": "SEC_06 // COMUNICAÇÃO",
      "contact.eyebrow": "Canal aberto",
      "contact.title": "Vamos tirar<br />uma ideia do papel?",
      "contact.body":
        "Fale comigo sobre oportunidades, projetos ou desenvolvimento de software.",
      "contact.copy": "COPIAR",
      "footer.track": "TRILHA //",
      "footer.license": "LICENÇA",
      "cmd.close": "FECHAR [ESC]",
      "cmd.welcome1": "SISTEMA CONECTADO // DOSSIÊ GUILHERME DAMASCENO (GD-01)",
      "cmd.welcome2":
        'Digite "help" ou clique nos atalhos acima para inspecionar missões, stack, contratos ou alternar o HUD.',
      cmdPlaceholder: "Digite um comando (ex: help, missions, lang en, theme netrunner)...",
      audioOn: "SOM ON",
      audioOff: "SOM OFF",
      contractOne: "contrato exibido",
      contractMany: "contratos exibidos",
      copiedOk: "✓ CANAL COPIADO PARA A ÁREA DE TRANSFERÊNCIA",
      copiedFallback: "CÓPIA MANUAL ·",
      tracePrefix: "RASTREAMENTO DE TECNOLOGIA //",
      traceSuffix: "OCORRÊNCIAS NO DOSSIÊ",
    },

    en: {
      pageTitle: "Guilherme Damasceno | Full Stack Developer",
      skip: "Skip to content",
      "nav.about": "Dossier",
      "nav.missions": "Missions",
      "nav.loadout": "Loadout",
      "nav.projects": "Contracts",
      "nav.training": "Training",
      "nav.contact": 'Contact <span aria-hidden="true">↗</span>',
      "hero.eyebrow":
        '<span class="status-light" aria-hidden="true"></span> Active profile <span class="eyebrow-divider">/</span> Full Stack Developer',
      "hero.desc": "Resilient back-end, integrations, and AI agents for enterprise systems.",
      "hero.context":
        "Working at Develcode on RD Saúde and Leroy Merlin squads — connecting systems, modernizing legacy applications, and automating workflows.",
      "hero.ctaPrimary": 'Explore missions <span aria-hidden="true">↘</span>',
      "hero.ctaCv": 'Resume PDF <span aria-hidden="true">↓</span>',
      "hero.bottomHint":
        'PRESS <b>CTRL+K</b> OR SCROLL TO EXPLORE <b aria-hidden="true">↓</b>',
      "card.role": "OPERATOR // FULL STACK",
      "card.companyLabel": "COMPANY",
      "card.squadsLabel": "SQUADS",
      "card.stackValue": "Java / Spring · C# / .NET · AI",
      "about.code": "SEC_01 // PROFILE",
      "about.eyebrow": "Dossier",
      "about.title": "I connect<br /><em>systems.</em>",
      "about.lead":
        "I build enterprise systems, APIs, and integrations. At Develcode, I work in RD Saúde and Leroy Merlin squads focused on back-end engineering, modernization, and automation.",
      "about.body":
        "My core stack centers on Java & Spring Boot, C# & .NET. I also design n8n workflows and use Python and JavaScript to power integrations, orchestrate AI agents, and eliminate manual toil.",
      "about.f1Label": "01 / COMPANY",
      "about.f1Sub": "Full Stack Developer",
      "about.f2Label": "02 / EDUCATION",
      "about.f2Sub": "Software Engineering · Estácio",
      "about.f3Label": "03 / FOCUS",
      "about.f3Title": "Back-end & AI",
      "about.f3Sub": "Resilience · integration · automation",
      "missions.code": "SEC_02 // EXPERIENCE",
      "missions.eyebrow": "Mission log",
      "missions.title": "Field operations",
      "missions.aside": "DEC/2025 — PRESENT<br />SQUADS / DEVELCODE",
      "missions.dtContext": "CONTEXT",
      "missions.dtActions": "DELIVERED",
      "missions.dtResult": "OUTCOME",
      "missions.stackHint": "STACK (CLICK ANY CHIP TO TRACE ACROSS DOSSIER)",
      "m1.title": "Resilient<br />AI agents",
      "m1.context":
        "Enterprise platform leveraging AI to generate and validate user stories and calculate story scoring.",
      "m1.p1":
        "Enforce mandatory field validation in Java 17 & Spring Boot: surface clear failure reasons, block invalid cards, and apply fail-closed feature flags.",
      "m1.p2":
        "Integrate Python (FastAPI, LangChain/LangGraph) with the corporate LLM gateway (AWS Bedrock), including correlation IDs, configurable timeouts, controlled HTTP errors, Langfuse tracing, and data masking.",
      "m1.p3":
        "Harden the AI agent with throttling retries, fault-tolerant schemas, and strict 1:1 item validation.",
      "m1.p4":
        "Expand automated test coverage; remediate dependency vulnerabilities (SCA/SAST) and mitigate XSS and Log Injection.",
      "m1.p5":
        "Support CI/CD pipelines, releases, and conflict resolution using Docker, Kubernetes, ArgoCD, and Datadog APM.",
      "m1.result":
        "Eliminated acceptance criteria loss during story analysis while strengthening validation and runtime resilience.",
      "m1.archHint": "OPERATIONAL PIPELINE // HOVER OR CLICK TO INSPECT",
      "m1.archCount": "4 STAGES",
      "m1.node2Title": "AI Agent",
      "m1.node2Sub": "FastAPI · LangGraph · 1:1 Validation",
      "m2.title": "Legacy system<br />modernization",
      "m2.context": "Maintenance and modernization of mission-critical legacy systems.",
      "m2.actions":
        "Refactor legacy applications using C# and .NET, apply design patterns, model persistence with ActiveRecord/NHibernate and PostgreSQL, and diagnose data integrity and business rule issues.",
      "m2.result":
        "Targeted refactorings delivered alongside root-cause investigation of complex data and domain rule issues.",
      "m3.cat": "CROSS-SQUAD · AUTOMATION",
      "m3.title": "Less routine.<br />More flow.",
      "m3.context": "Repetitive manual tasks and cross-service workflows.",
      "m3.actions":
        "Build workflow automations and service integrations with n8n, Python, JavaScript, and assistive AI.",
      "m3.result": "Reduced manual operational toil and improved workflow efficiency.",
      "loadout.code": "SEC_03 // SYSTEMS",
      "loadout.title": "Operational<br />loadout",
      "loadout.aside":
        "No invented percentages.<br />Click any technology chip to trace its usage.",
      "loadout.clearTrace": "CLEAR [×]",
      "loadout.s2": "Architecture & quality",
      "loadout.s3": "AI & agents",
      "loadout.s4": "Cloud & observability",
      "loadout.s6": "Data & persistence",
      "loadout.s7": "DevOps & automation",
      "loadout.s8": "Core foundations",
      "loadout.traits":
        "<b>TRAITS // </b>Collaboration · communication · organization · fast learning · problem solving",
      "loadout.lang": "<b>LANGUAGE // </b>Portuguese (Native) · English (Intermediate)",
      "chip.assistiveAi": "Assistive AI",
      "chip.ruleVal": "Rule validation",
      "chip.tests": "Automated tests",
      "chip.automation": "Automation",
      "chip.relDb": "Relational databases",
      "chip.reqEng": "Requirements engineering",
      "chip.ds": "Data structures",
      "chip.logic": "Logical reasoning",
      "chip.sysSec": "Systems security",
      "chip.bizRules": "Business rules",
      "projects.code": "SEC_04 // PROJECTS",
      "projects.eyebrow": "Contracts",
      "projects.title": "Featured work",
      "projects.aside": "Personal · academic · live demos",
      "projects.filterLabel": "FILTER BY TECHNOLOGY",
      "projects.filterAll": "All",
      "projects.openSite": 'Live demo <span aria-hidden="true">↗</span>',
      "projects.viewRepo": 'Repository <span aria-hidden="true">↗</span>',
      "p1.cat": "LANGUAGE LEARNING · WEB APP",
      "p1.desc":
        "Interactive English reading platform featuring graded stories, category & CEFR level filters, and gap-fill exercises.",
      "p2.desc":
        "Full-stack tech e-commerce store with catalog search, deals, and shopping cart backed by FastAPI and MongoDB.",
      "p3.cat": "FULL STACK APPLICATION",
      "p3.desc":
        "Book and user management system supporting full CRUD workflows with React, Node.js, Express, and MySQL.",
      "p4.cat": "MOBILE APPLICATION",
      "p4.desc":
        "Cross-platform food delivery mobile app featuring user auth, product categories, cart, and dark mode.",
      "p5.cat": "ACADEMIC SYSTEM",
      "p5.title": "Banking System",
      "p5.desc":
        "Core banking simulation implementing customer, branch, and account registration, balance inquiries, and statements.",
      "p6.cat": "BROWSER GAME",
      "p6.desc":
        "Browser-based daily word puzzle game featuring single (Termo), double (Dueto), and quad (Quarteto) modes.",
      "p7.cat": "ACADEMIC PROJECT · E-COMMERCE",
      "p7.desc":
        "Hardware e-commerce platform inspired by Terabyte, complete with product catalog, cart, and inventory dashboard.",
      "p8.cat": "ACADEMIC PROJECT · UI/UX",
      "p8.title": "Fitness App UI",
      "p8.desc":
        "Designed login, onboarding, user profile, and workout tracking screens focused on usability and responsive layout.",
      "p8.note": "PROTOTYPE · NO PUBLIC LINK",
      "training.code": "SEC_05 // EDUCATION",
      "training.eyebrow": "Training",
      "training.title": "Foundation in<br /><em>progress.</em>",
      "training.deg1": "Systems Analysis and Development",
      "training.done": "COMPLETED",
      "training.date2": "2025 — PRESENT",
      "training.deg2": "Software Engineering",
      "training.current": "IN PROGRESS",
      "training.coursesHeader": "ADDITIONAL TRAINING / 06 RECORDS",
      "contact.code": "SEC_06 // COMMS",
      "contact.eyebrow": "Open channel",
      "contact.title": "Ready to ship<br />an idea?",
      "contact.body":
        "Reach out regarding engineering roles, technical partnerships, or software projects.",
      "contact.copy": "COPY",
      "footer.track": "SOUNDTRACK //",
      "footer.license": "LICENSE",
      "cmd.close": "CLOSE [ESC]",
      "cmd.welcome1": "SYSTEM CONNECTED // GUILHERME DAMASCENO DOSSIER (GD-01)",
      "cmd.welcome2":
        'Type "help" or click a quick chip above to inspect missions, stack, contracts, language, or HUD modes.',
      cmdPlaceholder: "Type a command (e.g., help, missions, lang pt, theme netrunner)...",
      audioOn: "SOUND ON",
      audioOff: "SOUND OFF",
      contractOne: "contract displayed",
      contractMany: "contracts displayed",
      copiedOk: "✓ EMAIL COPIED TO CLIPBOARD",
      copiedFallback: "MANUAL COPY ·",
      tracePrefix: "TECH TRACE //",
      traceSuffix: "MATCHES IN DOSSIER",
    },
  };

  let savedAudioPreference = "off";
  let glitchEnabled = true;
  let currentThemeIndex = 0;
  let currentLang = "pt";
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

  const storedLang = safeGetStorage(window.localStorage, STORAGE_KEYS.lang);
  if (storedLang === "pt" || storedLang === "en") {
    currentLang = storedLang;
  }

  const t = (key) => I18N[currentLang]?.[key] ?? I18N.pt[key] ?? key;

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
    if (audioLabel) audioLabel.textContent = isPlaying ? t("audioOn") : t("audioOff");
    if (status && audioStatus) audioStatus.textContent = status;
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
  const STACK_ROTATION = {
    pt: [
      "Java 17 · Spring Boot · C# · .NET · n8n",
      "Python · FastAPI · LangGraph · AWS Bedrock",
      "Docker · Kubernetes · ArgoCD · Datadog APM",
      "PostgreSQL · NHibernate · APIs Resilientes",
    ],
    en: [
      "Java 17 · Spring Boot · C# · .NET · n8n",
      "Python · FastAPI · LangGraph · AWS Bedrock",
      "Docker · Kubernetes · ArgoCD · Datadog APM",
      "PostgreSQL · NHibernate · Resilient APIs",
    ],
  };

  if (terminalTyped && !motionPreference.matches) {
    let lineIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const tickTerminal = () => {
      const list = STACK_ROTATION[currentLang] || STACK_ROTATION.pt;
      const currentLine = list[lineIdx % list.length];
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
          lineIdx = (lineIdx + 1) % list.length;
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
  let activeSkillLabel = "";

  function renderSkillTraceBanner(count) {
    if (!traceBar || !traceText) return;
    if (activeSkill) {
      traceBar.hidden = false;
      traceText.textContent = `${t("tracePrefix")} ${(activeSkillLabel || activeSkill).toUpperCase()} · ${count} ${t("traceSuffix")}`;
    } else {
      traceBar.hidden = true;
    }
  }

  function setSkillTrace(skillKey, labelText = "") {
    activeSkill = activeSkill === skillKey ? "" : skillKey;
    activeSkillLabel = labelText;
    let count = 0;

    skillChips.forEach((chip) => {
      const keys = chip.dataset.skill.split(",");
      const match = Boolean(activeSkill) && keys.includes(activeSkill);
      chip.classList.toggle("is-skill-match", match);
      if (match) count += 1;
    });

    renderSkillTraceBanner(count);
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
  let activeProjectFilter = "all";

  filters.forEach((button) => {
    const filter = button.dataset.filter;
    const count =
      filter === "all"
        ? projectCards.length
        : projectCards.filter((card) => card.dataset.tech.split(",").includes(filter)).length;
    const badge = button.querySelector(".filter-count");
    if (badge) badge.textContent = `[${String(count).padStart(2, "0")}]`;
  });

  function updateFilterStatusLabel(visibleCount) {
    if (!filterStatus) return;
    filterStatus.textContent = `${visibleCount} ${
      visibleCount === 1 ? t("contractOne") : t("contractMany")
    }`;
  }

  function applyProjectFilter(filterValue, silent = false) {
    activeProjectFilter = filterValue;
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
        if (!silent && !motionPreference.matches && glitchEnabled) {
          void card.offsetWidth;
          card.classList.add("is-filtering-in");
        }
      }
    });

    updateFilterStatusLabel(visibleCount);
    if (!silent) playUiTick(780, 0.02);
    return visibleCount;
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => applyProjectFilter(button.dataset.filter));
  });

  /* ------------------------------------------------------------------------
     13. Bilingual Switcher (PT-BR / EN)
     ------------------------------------------------------------------------ */
  const langToggle = document.querySelector("#lang-toggle");
  const langLabel = document.querySelector("#lang-label");
  const cmdInput = document.querySelector("#cmd-input");

  function applyLanguage(lang, silent = false) {
    currentLang = lang === "en" ? "en" : "pt";
    root.lang = currentLang === "en" ? "en" : "pt-BR";
    document.title = t("pageTitle");

    if (langToggle) langToggle.dataset.lang = currentLang;
    if (langLabel) langLabel.textContent = currentLang.toUpperCase();

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const val = I18N[currentLang]?.[key];
      if (typeof val === "string") {
        window.clearInterval(el._scrambleTimer);
        el.textContent = val;
        if (el.hasAttribute("data-scramble")) {
          el.dataset.originalText = val;
        }
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.dataset.i18nHtml;
      const val = I18N[currentLang]?.[key];
      if (typeof val === "string") {
        el.innerHTML = val;
      }
    });

    if (cmdInput) {
      cmdInput.placeholder = t("cmdPlaceholder");
    }

    if (audioLabel && ambientAudio) {
      audioLabel.textContent = ambientAudio.paused ? t("audioOff") : t("audioOn");
    }

    const visibleProjects = projectCards.filter((card) => !card.hidden).length;
    updateFilterStatusLabel(visibleProjects);

    if (activeSkill) {
      const matchedCount = skillChips.filter((c) => c.classList.contains("is-skill-match")).length;
      renderSkillTraceBanner(matchedCount);
    }

    safeSetStorage(window.localStorage, STORAGE_KEYS.lang, currentLang);
    if (!silent) playUiTick(990, 0.025);
  }

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      applyLanguage(currentLang === "pt" ? "en" : "pt");
    });
  }
  applyLanguage(currentLang, true);

  /* ------------------------------------------------------------------------
     14. Copy Email Action
     ------------------------------------------------------------------------ */
  const copyButton = document.querySelector("#copy-email");
  const emailAddressEl = document.querySelector("#email-address");
  const copyFeedback = document.querySelector("#copy-feedback");

  async function copyEmailToClipboard() {
    if (!emailAddressEl) return false;
    const email = emailAddressEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      if (copyFeedback) copyFeedback.textContent = t("copiedOk");
      playUiTick(1120, 0.03);
      return true;
    } catch {
      if (copyFeedback) copyFeedback.textContent = `${t("copiedFallback")} ${email}`;
      return false;
    }
  }

  if (copyButton) {
    copyButton.addEventListener("click", copyEmailToClipboard);
  }

  /* ------------------------------------------------------------------------
     15. Interactive Netrunner Command Terminal (Ctrl+K / /)
     ------------------------------------------------------------------------ */
  const cmdBackdrop = document.querySelector("#cmd-backdrop");
  const cmdOutput = document.querySelector("#cmd-output");
  const cmdForm = document.querySelector("#cmd-form");
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
    "lang",
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
    const isEn = currentLang === "en";

    switch (cmd) {
      case "help":
        appendCmdLine(
          isEn
            ? [
                "AVAILABLE COMMANDS:",
                "  whoami              → Operator summary & current role",
                "  missions            → Field logs (RD Saúde, Leroy Merlin, Automation)",
                "  stack               → Primary technical loadout",
                "  projects [filter]   → Filter contracts (e.g., projects python)",
                "  lang [pt|en]        → Switch interface language (PT-BR / EN)",
                "  theme [name]        → Switch HUD palette (cyber | netrunner | arasaka)",
                "  audio [on|off]      → Toggle Synthwave soundtrack",
                "  glitch [on|off]     → Toggle CRT/glitch effects",
                "  email               → Copy professional email",
                "  cv                  → Download PDF resume",
                "  linkedin / github   → Open social profiles",
                "  clear / exit        → Clear output or close terminal",
              ].join("\n")
            : [
                "COMANDOS DISPONÍVEIS:",
                "  whoami              → Resumo do operador e vínculo atual",
                "  missions            → Log das missões (RD Saúde, Leroy Merlin, Automação)",
                "  stack               → Loadout técnico principal",
                "  projects [filtro]   → Navega/filtra contratos (ex: projects python)",
                "  lang [pt|en]        → Alterna idioma (PT-BR / EN)",
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
          isEn
            ? "GUILHERME DAMASCENO OLIVEIRA // Full Stack Developer at Develcode.\nAssigned to RD Saúde & Leroy Merlin squads · Systems Analysis (UNISO) & Software Eng. (Estácio)."
            : "GUILHERME DAMASCENO OLIVEIRA // Desenvolvedor Full Stack na Develcode.\nAtuação em squads da RD Saúde e Leroy Merlin · ADS (UNISO) & Eng. de Software (Estácio).",
          "accent"
        );
        break;

      case "missions":
        appendCmdLine(
          isEn
            ? [
                "[MISSION_01] RD SAÚDE · Resilient AI Agents (Java 17, Spring Boot, FastAPI, LangGraph, AWS Bedrock, Langfuse)",
                "[MISSION_02] LEROY MERLIN · Legacy Modernization (C#, .NET, ActiveRecord/NHibernate, PostgreSQL)",
                "[MISSION_03] CROSS-SQUAD · Workflow Automation & Integrations (n8n, Python, JS, AI)",
              ].join("\n")
            : [
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
          "CORE: Java 17 · Spring Boot · C# · .NET · Python · FastAPI\nAI & OPS: LangChain · LangGraph · AWS Bedrock · Langfuse · Docker · K8s · ArgoCD · Datadog\nDATA & WEB: PostgreSQL · MySQL · MongoDB · React · TypeScript · n8n",
          "accent"
        );
        document.querySelector("#competencias")?.scrollIntoView({ behavior: "smooth" });
        break;

      case "projects": {
        const validFilters = filters.map((f) => f.dataset.filter);
        const target = arg && validFilters.includes(arg) ? arg : "all";
        const count = applyProjectFilter(target);
        appendCmdLine(
          isEn
            ? `CONTRACT FILTER ACTIVE: [${target.toUpperCase()}] → ${count} project(s).`
            : `FILTRO DE CONTRATOS ATIVO: [${target.toUpperCase()}] → ${count} projeto(s).`,
          "accent"
        );
        document.querySelector("#projetos")?.scrollIntoView({ behavior: "smooth" });
        break;
      }

      case "lang": {
        const nextLang = arg === "en" || arg === "pt" ? arg : currentLang === "pt" ? "en" : "pt";
        applyLanguage(nextLang);
        appendCmdLine(
          nextLang === "en" ? "LANGUAGE SET TO: ENGLISH (EN)" : "IDIOMA DEFINIDO: PORTUGUÊS (PT-BR)",
          "accent"
        );
        break;
      }

      case "theme":
      case "overclock": {
        if (arg) {
          const idx = THEMES.findIndex((item) => item.id === arg);
          if (idx >= 0) {
            applyTheme(idx);
          } else {
            appendCmdLine("Valid palettes: cyber, netrunner, arasaka", "sys");
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
          appendCmdLine(ok ? "SOUNDTRACK ACTIVE (20% VOLUME)" : "AUDIO UNAVAILABLE", "accent");
        } else {
          saveAudioPreference("off");
          pauseAmbientAudio("TRILHA PAUSADA VIA TERMINAL");
          appendCmdLine("SOUNDTRACK PAUSED.", "sys");
        }
        break;
      }

      case "glitch": {
        if (arg === "on") glitchEnabled = true;
        else if (arg === "off") glitchEnabled = false;
        else glitchEnabled = !glitchEnabled;
        renderGlitchPreference();
        safeSetStorage(window.localStorage, STORAGE_KEYS.glitch, glitchEnabled ? "on" : "off");
        appendCmdLine(`GLITCH MODE: ${glitchEnabled ? "ON" : "OFF"}`, "accent");
        break;
      }

      case "email": {
        const copied = await copyEmailToClipboard();
        appendCmdLine(
          copied
            ? "Copied: guilhermedamascenooliveira@gmail.com"
            : "Email: guilhermedamascenooliveira@gmail.com",
          "accent"
        );
        break;
      }

      case "cv": {
        appendCmdLine("Downloading CV_Guilherme_Damasceno.pdf...", "accent");
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
        appendCmdLine("Opening LinkedIn...", "accent");
        break;

      case "github":
        window.open("https://github.com/Guilhermedms7", "_blank", "noopener,noreferrer");
        appendCmdLine("Opening GitHub...", "accent");
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
          isEn
            ? `Unknown command: "${cmd}". Type "help" to list commands.`
            : `Comando não reconhecido: "${cmd}". Digite "help" para listar os comandos.`,
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
     16. Tactical Boot Sequence (With Pause-on-Interaction Fix)
     ------------------------------------------------------------------------ */
  function startBootSequence() {
    if (motionPreference.matches) return;
    if (safeGetStorage(window.sessionStorage, STORAGE_KEYS.boot) === "yes") return;
    safeSetStorage(window.sessionStorage, STORAGE_KEYS.boot, "yes");

    const isEn = currentLang === "en";
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
        <p class="boot-prompt mono">${isEn ? "SELECT ENTRY MODE" : "SELECIONE O MODO DE ENTRADA"}</p>
        <div class="boot-actions">
          <button class="boot-action boot-action-primary mono" type="button">${
            isEn ? "ENTER WITH SOUND ♫" : "ENTRAR COM SOM ♫"
          }</button>
          <button class="boot-action mono" type="button">${
            isEn ? "SILENT MODE" : "MODO SILENCIOSO"
          }</button>
        </div>
        <button class="boot-skip mono" type="button">${
          isEn ? "SKIP INTRO [ESC]" : "PULAR ABERTURA [ESC]"
        }</button>
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
