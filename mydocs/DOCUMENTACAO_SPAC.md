# DOCUMENTAÇÃO COMPLETA - SPAC (Sistema Propósito de Avaliação Comportamental)

🎉 E aí, Gomez! Bora organizar esse projeto como se fosse um briefing
profissional, em **etapas modulares**, cada uma com **objetivo,
entregáveis e estrutura de pastas**, pra que qualquer agente de IA
consiga desenvolver sem se perder no meio do caminho. O foco é dar
**clareza, segmentação e fluidez** até chegar no deploy.

------------------------------------------------------------------------

# 1) Visão Geral & Requisitos Funcionais

**Módulos da aplicação** - **Cadastro/Home**: tela de boas-vindas; login
para acesso ao Dashboard (usuário ADM GERAL já definido). -
**Formulário**: 5 páginas (4 de perguntas + 1 de agradecimento);
cabeçalho persistente; "Enviar" ativa botão "Sair"; navegar
**PRÓXIMA/VOLTAR** reposiciona no topo; última página troca "PRÓXIMA"
por "FINALIZAR". - **Dashboard (RH/ADM)**: lista cartões com nome,
e-mail, score, status; clique → **detalhamento completo** (Perfil,
Competências, Áreas de Desenvolvimento, Recomendações, Interesses);
download individual e **consolidado XLSX** com seleção de campos; link
para Formulário; logout; **Configurações** (bloqueado para RH, liberado
para ADM). - **Painel de Configurações (ADM)**: métricas; acesso ao
**Painel de API**; **limpeza total**; **backup** do banco; CRUD de
usuários (ADM GERAL e RH) com **senha aleatória de 4 dígitos**; remoção
de candidato/teste. - **Painel de API**: instruções e endpoints para
integração (ex.: Gupy).

**Regras críticas** - **1 teste por Nome+Email**; se houver nova
tentativa, mostrar mensagem de bloqueio + agradecimento. **Obrigatório
Nome e Sobrenome**. - **Acesso ao Dashboard apenas para usuários
cadastrados**; **Configurações** só habilita para **ADM GERAL**. -
**Scoring**: cada pergunta permite **até 5 escolhas**; o usuário deve
**desmarcar** para trocar; somatório gera **SCORE (1--100)** e
**Status**:\
- **Até 67**: Abaixo da expectativa\
- **68--75**: Dentro da expectativa\
- **76--90**: Acima da expectativa\
- **≥ 91**: Superou a expectativa

**ADM GERAL inicial**: **ROBERIO GOMES DOS SANTOS --
robgomez.sir@gmail.com -- senha: admin1630**

------------------------------------------------------------------------

# 2) Arquitetura & Stack

-   **Frontend/Backend**: **Next.js (App Router)** com **TypeScript**
-   **Autenticação & DB**: **Supabase** (Auth + Postgres + RLS)
-   **UI**: Tailwind CSS; componentes desacoplados
-   **Export**: SheetJS (xlsx) para planilhas
-   **Deploy**: **Vercel**
-   **Logs/Observabilidade**: Vercel Logs; opcional Sentry

------------------------------------------------------------------------

# 3) Estrutura de Pastas (Final)

    spac/
      .env.example
      package.json
      /config
      /docs
      /database
      /src
      /tests

*(Estrutura detalhada já descrita acima, mantida integralmente na
documentação)*

------------------------------------------------------------------------

# 4) Modelagem de Dados (Supabase)

(Tabelas: users, candidates, submissions, answers, scores + policies
RLS)

------------------------------------------------------------------------

# 5) Autenticação & Autorização

-   Login via email+senha
-   Proteção de rotas com roles (ADMIN/RH)
-   Configurações apenas para ADMIN

------------------------------------------------------------------------

# 6) Lógica do Formulário & UX

-   5 páginas (4 perguntas + agradecimento)
-   Seleção limitada a 5 opções
-   Scroll-top ao navegar
-   Bloqueio de segunda tentativa
-   Obrigatório Nome + Sobrenome

------------------------------------------------------------------------

# 7) Scoring & Perfilamento

-   Q1 e Q2: adjetivos com pesos (1,2,3)
-   Q3: frases com pesos (3--5)
-   Q4: valores com pesos (7--9)
-   Total: 1--100 → status
-   Perfil gerado em JSON (Perfil, Competências, Áreas, Recomendações,
    Interesses)

------------------------------------------------------------------------

# 8) Fluxos de Tela (UX/Rotas)

-   Home/Login
-   Formulário (Q1--Q4 + Finish)
-   Dashboard (lista, detalhe, export)
-   Configurações (CRUD usuários, backup, API)

------------------------------------------------------------------------

# 9) API Interna & Externa

-   Base: `/api/v1`
-   Auth: Bearer Token
-   Endpoints: candidatos, scores, export, tokens

------------------------------------------------------------------------

# 10) Exportação & Backup

-   Export individual (XLSX/JSON)
-   Export consolidado XLSX com seleção de colunas
-   Backup via dump JSON/CSV/ZIP

------------------------------------------------------------------------

# 11) Segurança & Conformidade

-   RLS ativo em todas as tabelas
-   Hash de senha
-   Sanitização/validação
-   Proteção de rotas

------------------------------------------------------------------------

# 12) Deploy (Vercel)

-   Conectar repositório GitHub
-   Definir variáveis .env no Vercel
-   Executar migrações
-   Deploy contínuo

------------------------------------------------------------------------

# 13) Testes

-   Unit (scoring, profiling, validações)
-   Integração (API, export, RLS)
-   E2E (fluxo completo, bloqueio 1 tentativa, CRUD ADM)

------------------------------------------------------------------------

# 14) Passo a Passo de Implementação

1.  Setup & Infra
2.  DB & seeds
3.  Auth
4.  Formulário
5.  Scoring + Perfilamento
6.  Dashboard
7.  Configurações
8.  API externa
9.  Testes
10. Deploy

------------------------------------------------------------------------

# 15) Apêndices

-   `.env.example`
-   Mapa de Pesos (constants.ts)
-   Função Export XLSX
-   Função Perfilamento

------------------------------------------------------------------------

# 16) Operação & Suporte

-   Limpeza total (Configurações)
-   Deletar candidato/teste
-   Painel de API com docs

------------------------------------------------------------------------

# 17) Roadmap

-   V1: núcleo (form, scoring, dashboard, export)
-   V1.1: Configurações + backup + API
-   V1.2: Métricas avançadas
-   V2: Internacionalização, relatórios PDF, webhooks
