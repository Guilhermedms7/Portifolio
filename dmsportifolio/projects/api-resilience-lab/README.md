# API Resilience Lab

Um playground interativo para visualizar como **Retry**, **Circuit Breaker** e **Feature Flags** influenciam o comportamento de integrações HTTP.

Ajuste latência e probabilidade de falha, execute uma sequência de eventos e acompanhe entregas, retries, bloqueios e o estado do circuito em tempo real.

## Abrir sem instalar nada

O projeto não usa pacotes, servidor, banco de dados ou ferramentas de build.

1. Abra `index.html` em qualquer navegador moderno.
2. Ajuste os controles do cenário.
3. Clique em **Executar simulação** e acompanhe os resultados no painel.

Quando publicado no GitHub Pages, o playground também pode ser acessado por uma URL pública, direto no navegador.

## O que dá para explorar

- **Probabilidade de falha e latência:** simule respostas instáveis e lentas.
- **Retry automático:** compare intervalo fixo com backoff exponencial e controle o máximo de tentativas.
- **Circuit Breaker:** o circuito abre após três falhas consecutivas, bloqueia novas tentativas por oito segundos e permite uma chamada de teste no estado meio aberto.
- **Feature Flag:** ative ou pause o envio simulado de novos eventos.
- **Observabilidade:** acompanhe taxa de sucesso, entregas, falhas, retries, bloqueios e histórico recente.
- **Tipos de evento de demonstração:** pedidos, pagamentos, clientes e estoque.

## Como funciona

Toda a lógica roda no navegador, com JavaScript e estado em memória. A latência e as falhas são simuladas; nenhum evento é enviado a um serviço real. Recarregar a página limpa a sessão.

O projeto serve como demonstração didática dos padrões de resiliência e de uma interface de acompanhamento. **Não é um serviço de integração em produção** e não requer chaves, contas ou dados reais.

## Tecnologias

- HTML semântico
- CSS responsivo
- JavaScript puro, sem dependências externas

## Estrutura

```text
dmsportifolio/
└── projects/
    └── api-resilience-lab/
        ├── index.html   # interface do playground
        ├── styles.css   # identidade visual e layout responsivo
        ├── app.js       # simulação de eventos e padrões de resiliência
        └── README.md    # documentação
```

## Próximos passos possíveis

- Conectar o playground a uma API real em Java e Spring Boot.
- Persistir integrações e histórico em PostgreSQL.
- Adicionar autenticação, auditoria e documentação OpenAPI.

## Autor

Guilherme Damasceno · [GitHub](https://github.com/Guilhermedms7) · [LinkedIn](https://www.linkedin.com/in/guilherme-damasceno-oliveira-a308b226a/)
