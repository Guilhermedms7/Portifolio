# API Resilience Lab

Um playground interativo para visualizar como **Retry**, **Circuit Breaker** e **Feature Flags** influenciam o comportamento de integraÃ§Ãµes HTTP.

Ajuste latÃªncia e probabilidade de falha, execute uma sequÃªncia de eventos e acompanhe entregas, retries, bloqueios e o estado do circuito em tempo real.

## Abrir sem instalar nada

O projeto nÃ£o usa pacotes, servidor, banco de dados ou ferramentas de build.

1. Abra `index.html` em qualquer navegador moderno.
2. Ajuste os controles do cenÃ¡rio.
3. Clique em **Executar simulaÃ§Ã£o** e acompanhe os resultados no painel.

Quando publicado no GitHub Pages, o playground tambÃ©m pode ser acessado por uma URL pÃºblica, direto no navegador.

## O que dÃ¡ para explorar

- **Probabilidade de falha e latÃªncia:** simule respostas instÃ¡veis e lentas.
- **Retry automÃ¡tico:** compare intervalo fixo com backoff exponencial e controle o mÃ¡ximo de tentativas.
- **Circuit Breaker:** o circuito abre apÃ³s trÃªs falhas consecutivas, bloqueia novas tentativas por oito segundos e permite uma chamada de teste no estado meio aberto.
- **Feature Flag:** ative ou pause o envio simulado de novos eventos.
- **Observabilidade:** acompanhe taxa de sucesso, entregas, falhas, retries, bloqueios e histÃ³rico recente.
- **Tipos de evento de demonstraÃ§Ã£o:** pedidos, pagamentos, clientes e estoque.

## Como funciona

Toda a lÃ³gica roda no navegador, com JavaScript e estado em memÃ³ria. A latÃªncia e as falhas sÃ£o simuladas; nenhum evento Ã© enviado a um serviÃ§o real. Recarregar a pÃ¡gina limpa a sessÃ£o.

O projeto serve como demonstraÃ§Ã£o didÃ¡tica dos padrÃµes de resiliÃªncia e de uma interface de acompanhamento. **NÃ£o Ã© um serviÃ§o de integraÃ§Ã£o em produÃ§Ã£o** e nÃ£o requer chaves, contas ou dados reais.

## Tecnologias

- HTML semÃ¢ntico
- CSS responsivo
- JavaScript puro, sem dependÃªncias externas

## Estrutura

```text
api-resilience-lab/
â”œâ”€â”€ index.html   # interface do playground
â”œâ”€â”€ styles.css   # identidade visual e layout responsivo
â”œâ”€â”€ app.js       # simulaÃ§Ã£o de eventos e padrÃµes de resiliÃªncia
â””â”€â”€ README.md    # documentaÃ§Ã£o
```

## PrÃ³ximos passos possÃ­veis

- Conectar o playground a uma API real em Java e Spring Boot.
- Persistir integraÃ§Ãµes e histÃ³rico em PostgreSQL.
- Adicionar autenticaÃ§Ã£o, auditoria e documentaÃ§Ã£o OpenAPI.

## Autor

Guilherme Damasceno Â· [GitHub](https://github.com/Guilhermedms7) Â· [LinkedIn](https://www.linkedin.com/in/guilherme-damasceno-oliveira-a308b226a/)

