# Análise Técnica e Especificação de Requisitos – SPAC

Este documento consolida os requisitos técnicos e funcionais para o desenvolvimento do **SPAC (Sistema Propósito de Avaliação Comportamental)**. Ele serve como a fonte de verdade para a equipe de desenvolvimento, alinhando a visão do produto com a implementação técnica.

---

### 1. Visão Geral do Projeto

*   **Nome da Aplicação:** SPAC (Sistema Propósito de Avaliação Comportamental)
*   **Propósito:** Fornecer uma plataforma para a realização de avaliações comportamentais de candidatos. O sistema gerencia o fluxo desde a resposta do formulário até a análise de resultados por parte da equipe de RH e Administradores, gerando scores e perfis detalhados para apoiar a tomada de decisão.

---

### 2. Arquitetura e Tecnologias

A arquitetura do projeto seguirá uma abordagem moderna baseada em Jamstack, com um backend-as-a-service (BaaS) para agilizar o desenvolvimento e garantir escalabilidade. A stack tecnológica confirmada é:

| Componente | Tecnologia / Serviço | Justificativa |
| :--- | :--- | :--- |
| **Frontend/Backend** | Next.js 14+ (App Router) com TypeScript | Renderização híbrida (SSR/SSG/Client), tipagem estática para robustez e uma estrutura baseada em componentes para reuso e manutenibilidade. |
| **Banco de Dados & Auth** | Supabase (PostgreSQL + Auth) | Solução integrada que fornece banco de dados relacional, autenticação, autorização via RLS (Row-Level Security) e APIs geradas automaticamente. |
| **Estilização (UI)** | Tailwind CSS | Framework utility-first que permite a criação de interfaces customizadas de forma rápida e consistente. |
| **Exportação de Dados** | SheetJS (`xlsx`) | Biblioteca padrão para a geração de planilhas XLSX no lado do cliente, atendendo ao requisito de exportação consolidada e individual. |
| **Hospedagem & Deploy** | Vercel | Plataforma otimizada para Next.js, oferecendo deploy contínuo (CI/CD) integrado ao GitHub, escalabilidade automática e CDN global. |
| **Observabilidade** | Vercel Logs / Sentry (Opcional) | Monitoramento de logs e erros para garantir a saúde da aplicação em produção. |

---

### 3. Modelo de Dados (Schema Supabase)

A estrutura do banco de dados é projetada para garantir integridade, segurança e performance. As políticas de RLS (Row-Level Security) serão aplicadas para controlar o acesso aos dados com base no perfil do usuário (`ADMIN_GERAL`, `RH`).

| Tabela | Coluna | Tipo de Dado | Descrição e Constraints |
| :--- | :--- | :--- | :--- |
| **`perfis`** | `id` | `uuid` | Chave Primária (referencia `auth.users.id`). |
| | `email` | `text` | E-mail do usuário (único). |
| | `nome_completo` | `text` | Nome do usuário do sistema. |
| | `role` | `enum('ADMIN_GERAL', 'RH')` | Papel do usuário para controle de acesso. |
| **`candidatos`** | `id` | `uuid` | Chave Primária. |
| | `nome_completo` | `text` | Nome completo do candidato. **Obrigatório.** |
| | `email` | `text` | E-mail do candidato. **Obrigatório.** |
| | `criado_em` | `timestamptz` | Data de registro. |
| | *Constraint* | `UNIQUE(nome_completo, email)` | Garante a regra de **1 teste por candidato**. |
| **`avaliacoes`** | `id` | `uuid` | Chave Primária. |
| | `candidato_id` | `uuid` | Chave Estrangeira para `candidatos.id`. |
| | `status` | `enum('concluido', 'em_andamento')` | Status do preenchimento. |
| | `finalizado_em` | `timestamptz` | Data de conclusão da avaliação. |
| **`perguntas`** | `id` | `serial` | Chave Primária. |
| | `texto_pergunta`| `text` | O enunciado da pergunta. |
| | `ordem` | `int` | Ordem de exibição no formulário. |
| | `pagina` | `int` | Página do formulário (1 a 4). |
| **`opcoes_resposta`** | `id` | `serial` | Chave Primária. |
| | `pergunta_id` | `int` | Chave Estrangeira para `perguntas.id`. |
| | `texto_opcao` | `text` | O texto da alternativa (adjetivo, frase, valor). |
| | `peso` | `int` | Valor numérico da opção para cálculo do score. |
| **`respostas_candidato`** | `id` | `bigserial` | Chave Primária. |
| | `avaliacao_id` | `uuid` | Chave Estrangeira para `avaliacoes.id`. |
| | `opcao_id` | `int` | Chave Estrangeira para `opcoes_resposta.id`. |
| **`resultados`** | `id` | `uuid` | Chave Primária (mesmo ID da `avaliacao`). |
| | `avaliacao_id` | `uuid` | Chave Estrangeira para `avaliacoes.id`. |
| | `score_final` | `int` | Score calculado (1-100). |
| | `classificacao` | `text` | Status do resultado (ex: "Acima da expectativa"). |
| | `perfil_json` | `jsonb` | Objeto JSON com o perfil detalhado (Competências, Áreas de Desenvolvimento, Recomendações, etc.). |

---

### 4. Funcionalidades Detalhadas

#### 4.1. Autenticação e Autorização
- **Fluxo de Login:** Usuários (`ADMIN_GERAL`, `RH`) acessam o sistema via e-mail e senha pela rota `/auth/login`.
- **Proteção de Rotas:** Um `middleware` irá interceptar requisições para rotas protegidas:
    - `/dashboard/*`: Acessível apenas para `ADMIN_GERAL` e `RH`.
    - `/settings/*`: Acessível **exclusivamente** para `ADMIN_GERAL`.
- **Gerenciamento de Usuários (Admin):** O `ADMIN_GERAL` poderá criar novos usuários (`ADMIN_GERAL`, `RH`). A senha inicial será gerada aleatoriamente (4 dígitos) e deverá ser informada ao novo usuário.

#### 4.2. Formulário de Avaliação (Fluxo do Candidato)
- **Acesso:** O formulário é público.
- **Validação de Unicidade:** Antes de iniciar, o sistema verifica se a combinação `Nome Completo` + `Email` já existe na tabela `candidatos`. Se sim, exibe uma mensagem de agradecimento e bloqueia uma nova tentativa.
- **Estrutura:**
    1.  **Páginas 1-4:** Apresentam as perguntas carregadas do banco de dados.
    2.  **Navegação:** Botões `PRÓXIMA` e `VOLTAR` permitem navegar entre as páginas. O scroll é reposicionado para o topo a cada navegação.
    3.  **Seleção de Respostas:** O candidato pode selecionar **até 5 opções** por pergunta. A interface deve permitir marcar e desmarcar opções.
    4.  **Página Final:** Na última página de perguntas, o botão `PRÓXIMA` é substituído por `FINALIZAR`.
    5.  **Página de Agradecimento:** Após clicar em `FINALIZAR`, o candidato é redirecionado para uma página de agradecimento.
- **Submissão de Dados:** Ao finalizar, as respostas são salvas na tabela `respostas_candidato` e um processo de background (ou trigger) é disparado para calcular o score e gerar o perfil na tabela `resultados`.

#### 4.3. Dashboard (Painel RH/Admin)
- **Visualização Principal:** Uma lista de candidatos em formato de cartões, exibindo `Nome`, `Email`, `Score Final` e `Classificação`.
- **Busca e Filtragem:** Funcionalidade para buscar candidatos por nome ou email.
- **Detalhes do Candidato:** Ao clicar em um cartão, o usuário é levado a uma página de detalhe (`/dashboard/[id]`) que exibe o perfil completo gerado (`perfil_json`).
- **Exportação:**
    - **Individual:** Botão para download do perfil completo do candidato em formato XLSX.
    - **Consolidada:** Funcionalidade para selecionar múltiplos candidatos e exportar dados selecionados (ex: Nome, Email, Score) para um único arquivo XLSX.

#### 4.4. Painel de Configurações (Acesso Exclusivo `ADMIN_GERAL`)
- **Gerenciamento de Usuários:** Interface para CRUD (Criar, Ler, Atualizar, Deletar) de usuários do sistema (`ADMIN_GERAL`, `RH`).
- **Gerenciamento de Dados:**
    - **Limpeza Total:** Funcionalidade crítica para apagar **todos** os dados de candidatos, avaliações e resultados. Requer dupla confirmação.
    - **Backup do Banco:** Opção para gerar e baixar um dump (`.sql` ou `.csv`) das tabelas principais.
    - **Remoção Individual:** Ferramenta para remover um candidato específico e todos os seus dados associados.
- **Painel de API:** Uma seção informativa com a documentação dos endpoints da API externa, chaves de acesso e exemplos de uso para integrações (ex: Gupy).

---

### 5. Estrutura de Pastas Sugerida (Next.js)

A estrutura de diretórios foi projetada para promover organização, escalabilidade e uma clara separação de responsabilidades, combinando as melhores práticas do ecossistema Next.js.

```plaintext
spac/
├── .env.local                # Variáveis de ambiente locais (não versionadas)
├── .env.example              # Exemplo de variáveis de ambiente
├── next.config.mjs           # Configurações do Next.js
├── package.json              # Dependências e scripts do projeto
├── tailwind.config.ts        # Configurações do Tailwind CSS
├── tsconfig.json             # Configurações do TypeScript
│
├── /database/                # Scripts de banco de dados
│   ├── schema.sql            # Definição de tabelas e tipos
│   ├── policies.sql          # Políticas de Row-Level Security (RLS)
│   └── seeds.sql             # Dados iniciais (usuário ADMIN_GERAL)
│
├── /docs/                    # Documentação do projeto
│   └── api.md                # Documentação da API externa
│
└── /src/
    ├── /app/                 # Rotas e páginas (App Router)
    │   ├── /auth/            # Rotas de autenticação (login, etc.)
    │   ├── /dashboard/       # Rotas do painel de RH/Admin
    │   ├── /form/            # Rotas do formulário de avaliação
    │   ├── /settings/        # Rotas do painel de configurações
    │   ├── layout.tsx        # Layout principal da aplicação
    │   └── page.tsx          # Página inicial (Home/Login)
    │
    ├── /components/          # Componentes de UI reutilizáveis
    │   ├── /ui/              # Componentes genéricos (Button, Input, Card)
    │   └── /shared/          # Componentes específicos da aplicação
    │
    ├── /lib/                 # Lógica de negócio e utilitários
    │   ├── supabase.ts       # Cliente e tipos do Supabase
    │   ├── auth.ts           # Funções relacionadas à autenticação
    │   ├── scoring.ts        # Lógica de cálculo de score
    │   ├── profiling.ts      # Lógica de geração de perfil textual
    │   └── utils.ts          # Funções utilitárias gerais
    │
    ├── /store/               # Gerenciamento de estado global (Zustand, etc.)
    │
    ├── /styles/              # Estilos globais
    │   └── globals.css
    │
    └── /middleware.ts        # Middleware para proteção de rotas
```