# 📑 Briefing Detalhado do Desenvolvimento do SPAC

## 1. Planejamento e Setup Inicial

**Objetivo:** Preparar ambiente e fundações do projeto.\
**Atividades:** 1. Definir stack (Next.js + Supabase + Tailwind +
Vercel). 2. Configurar repositório GitHub. 3. Criar Supabase project
(schemas, tabelas). 4. Definir variáveis de ambiente (.env). 5.
Estruturar base do projeto com roteamento inicial.

**Estrutura de Pastas:**

    /spac-app
      /docs                -> Documentação inicial
      /design              -> Mockups, wireframes
      /config              -> Arquivos de configuração (eslint, prettier, tailwind)
      /src
        /app               -> Páginas e rotas (Next.js)
        /components        -> Componentes reutilizáveis
        /lib               -> Funções utilitárias (API, DB, auth)
      .env.example
      package.json

------------------------------------------------------------------------

## 2. Banco de Dados (Supabase)

**Objetivo:** Modelar e criar as tabelas para usuários, respostas e
perfis.\
**Atividades:** 1. Criar tabela `users` (admins, RH, candidatos). 2.
Criar tabela `tests` (respostas brutas). 3. Criar tabela `scores` (score
calculado + perfilamento). 4. Definir policies de acesso (RLS --
row-level security). 5. Criar seeds para ADMIN GERAL inicial.

**Estrutura de Pastas:**

    /spac-app
      /database
        schema.sql         -> Script com todas as tabelas
        policies.sql       -> Regras de acesso
        seeds.sql          -> Admin geral inicial

------------------------------------------------------------------------

## 3. Autenticação e Cadastro

**Objetivo:** Criar fluxo de login/cadastro para ADMIN GERAL e RH.\
**Atividades:** 1. Implementar login (email + senha). 2. Criar tela
inicial (Home). 3. Garantir regra de 1 teste por candidato (nome+email
únicos). 4. Configurar proteção de rotas (somente RH/Admin no
Dashboard).

**Estrutura de Pastas:**

    /src
      /app
        /auth
          login.tsx
          register.tsx
        /middleware.ts       -> Proteção de rotas

------------------------------------------------------------------------

## 4. Formulário do Teste

**Objetivo:** Implementar fluxo do questionário (4 páginas de
perguntas + página de agradecimento).\
**Atividades:** 1. Criar cabeçalho persistente. 2. Criar 4 páginas com
perguntas e lógica de seleção (máx. 5 respostas). 3. Implementar
validação (se já respondeu, não permitir novamente). 4. Página final:
agradecimento + botão enviar (ativa botão sair). 5. Gravar respostas no
DB.

**Estrutura de Pastas:**

    /src
      /app
        /form
          page1.tsx
          page2.tsx
          page3.tsx
          page4.tsx
          finish.tsx
      /components
        QuestionCard.tsx
        AnswerOption.tsx

------------------------------------------------------------------------

## 5. Cálculo de Score e Perfilamento

**Objetivo:** Implementar lógica de pesos, score e geração de perfil
textual.\
**Atividades:** 1. Criar função utilitária `calculateScore(respostas)`.
2. Determinar status (abaixo, dentro, acima, superou). 3. Gerar visão
corporativa (perfil, competências, áreas de desenvolvimento,
recomendações, interesses). 4. Salvar score + perfil no DB.

**Estrutura de Pastas:**

    /src
      /lib
        scoring.ts          -> Função de cálculo de score
        profiling.ts        -> Geração de visão textual

------------------------------------------------------------------------

## 6. Dashboard

**Objetivo:** Criar painel com métricas e detalhamento individual.\
**Atividades:** 1. Listagem de candidatos (nome, email, score, status).
2. Cartões individuais → ao clicar, abrir visão detalhada. 3. Botões de
download (individual e consolidado em XLSX). 4. Botão de acesso ao
formulário e logout. 5. Filtro e busca por candidato.

**Estrutura de Pastas:**

    /src
      /app
        /dashboard
          index.tsx
          [id].tsx           -> Detalhes de candidato
      /components
        CandidateCard.tsx
        ExportModal.tsx

------------------------------------------------------------------------

## 7. Painel de Configurações

**Objetivo:** Permitir gestão avançada por ADMIN GERAL.\
**Atividades:** 1. Inclusão/remoção de usuários (Admins e RH). 2. Botão
para limpar dashboard. 3. Download de backup do banco. 4. Exclusão de
candidatos específicos. 5. Métricas adicionais (customizáveis).

**Estrutura de Pastas:**

    /src
      /app
        /settings
          index.tsx
          users.tsx
          backup.tsx

------------------------------------------------------------------------

## 8. API

**Objetivo:** Disponibilizar integração externa com plataformas de RH
(ex: Gupy).\
**Atividades:** 1. Criar endpoints REST (/api/candidates, /api/scores).
2. Configurar autenticação via token. 3. Documentar endpoints (Swagger
ou Markdown).

**Estrutura de Pastas:**

    /src
      /pages/api
        candidates.ts
        scores.ts
      /docs
        api.md

------------------------------------------------------------------------

## 9. Deploy (Vercel)

**Objetivo:** Publicar aplicação para uso.\
**Atividades:** 1. Configurar variáveis de ambiente no Vercel. 2. Deploy
contínuo via GitHub. 3. Testes manuais no ambiente de produção.

------------------------------------------------------------------------

## 10. Testes e Validação Final

**Objetivo:** Garantir que tudo funciona integrado.\
**Atividades:** 1. Testar fluxo completo: cadastro → teste → score →
dashboard → download. 2. Validar regras de acesso (somente RH/Admin veem
o Dashboard). 3. Testar API externa. 4. Validar UX/UI.

------------------------------------------------------------------------

👉 Esse briefing está pronto pra guiar qualquer IA ou dev a construir o
SPAC em blocos bem claros.
