# Portfólio — Guilherme Damasceno Oliveira

Portfólio pessoal bilíngue (`PT-BR` / `EN`) de Guilherme Damasceno, desenvolvedor full stack na Develcode. Apresento minha atuação em squads da RD Saúde e da Leroy Merlin, com foco em Java/Spring Boot, C#/.NET, integrações, agentes de IA e automação.

[![Acessar o portfólio](https://img.shields.io/badge/PORTF%C3%93LIO-ACESSAR_SITE-07070D?style=for-the-badge&logo=cloudflarepages&logoColor=FCEE0A)](https://guilherme-damasceno.pages.dev)

Sou formado em Análise e Desenvolvimento de Sistemas pela Universidade de Sorocaba (UNISO) e curso Engenharia de Software na Estácio. Também trabalho com JavaScript, Python, React.js e outras tecnologias descritas no portfólio.

## Stack do site

- HTML5 semântico com dados estruturados (`JSON-LD`), `canonical`, `robots.txt` e `sitemap.xml`
- CSS puro (`styles/global.css`), organizado em tokens, paletas de HUD, base, componentes, efeitos e responsividade
- JavaScript puro (`scripts/main.js`) para internacionalização instantânea (`PT` / `EN`), terminal interativo, telemetria, filtros, rastreamento de stack, áudio e preferências
- Google Fonts: Chakra Petch e JetBrains Mono, com alternativas de sistema
- Sem frameworks, bibliotecas de interface ou etapa de build

## Estrutura

```text
README.md
portfolio/
├── index.html
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── CV_Guilherme_Damasceno.pdf
├── assets/
│   └── audio/
│       └── mixkit-lonerism-159.mp3
├── scripts/
│   └── main.js
├── styles/
│   └── global.css
└── images/
    └── og-image.jpg
```

## Rodar localmente

Abra `portfolio/index.html` diretamente em um navegador moderno. Não é necessário instalar dependências nem iniciar um servidor.

## Publicar no Cloudflare Pages

Conecte este repositório ao Cloudflare Pages usando a branch `main`, sem comando de build e com `portfolio` como diretório de saída. O site é estático e não requer instalação de dependências.

## Direção visual e recursos interativos

Interface autoral inspirada em painéis operacionais futuristas e dossiês táticos cyberpunk: fundo azul-noite, amarelo néon como ação padrão e ciano/magenta como acentos pontuais. A experiência prioriza leitura rápida, contraste, navegação por teclado e movimento reduzido quando solicitado pelo sistema.

- **Modo Bilíngue Instantâneo (`PT` / `EN`):** alternância imediata no topo (ou via comando `lang` no terminal) sem recarregamento de página, com preferência persistida localmente.
- **Terminal Netrunner (`Ctrl+K` ou `/`):** linha de comando interativa com histórico, autocompletar (`Tab`) e atalhos rápidos (`help`, `whoami`, `missions`, `stack`, `projects`, `lang`, `theme`, `audio`, `glitch`, `email`, `cv`).
- **Cartão de Identidade Holográfico 3D:** inclinação em perspectiva reativa ao ponteiro, reflexo especular, scanner biométrico e pulsos animados de circuito.
- **Blueprint Interativo de Arquitetura (`MISSION_01`):** pipeline operacional em 4 estágios (`Core API` → `Agente IA` → `LLM & Trace` → `Cloud & Sec`) que destaca as entregas técnicas correspondentes ao passar o mouse ou clicar.
- **Rastreamento Transversal de Tecnologias:** clicar em qualquer chip de tecnologia ilumina todas as ocorrências daquela ferramenta entre Missões, Loadout e Contratos.
- **Paletas de HUD (Overclock):** alternância persistente entre `CYBER // YELLOW`, `NETRUNNER // CYAN` e `ARASAKA // CRIMSON`, além do controle `GLITCH: ON/OFF`.
- **Áudio Synthwave & Equalizador:** trilha opcional “Lonerism” (Alejandro Magaña · [Mixkit](https://mixkit.co/free-stock-music/synthwave/)) em 20% de volume, equalizador animado no topo, micro-feedback sonoro sintetizado via Web Audio API quando ativo e pausa automática ao trocar de aba.
- **Sequência de Boot Tático:** diagnóstico rápido na primeira visita da sessão com pausa inteligente ao interagir com os botões de entrada com/sem som.
- **SEO & Open Graph dedicado:** banner cyberpunk em `portfolio/images/og-image.jpg`, URL canônica, `robots.txt` e `sitemap.xml`.

## Notas de conteúdo

- A faixa musical é usada sob a [Mixkit Stock Music Free License](https://mixkit.co/license/#musicFree).
- Experiências Leroy Merlin e automação mantêm comentários `TODO` no HTML caso métricas quantitativas públicas sejam adicionadas futuramente; nenhuma métrica inventada foi publicada.

## Contato

- [LinkedIn](https://www.linkedin.com/in/guilherme-damasceno-oliveira-a308b226a/)
- [GitHub](https://github.com/Guilhermedms7)
- E-mail: [guilhermedamascenooliveira@gmail.com](mailto:guilhermedamascenooliveira@gmail.com)
