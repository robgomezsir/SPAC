# Estrutura de Pastas - SPAC

```
spac-app/
├── .env.example
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
│
├── /docs                          # Documentação
│   ├── README.md
│   └── api.md
│
├── /database                      # Scripts de banco
│   ├── schema.sql
│   ├── policies.sql
│   └── seeds.sql
│
├── /src                          # Código fonte
│   ├── /app                      # App Router (Next.js 13+)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Home/Login
│   │   │
│   │   ├── /auth                 # 🔐 Autenticação
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── /form                 # 📋 Formulário do Teste
│   │   │   ├── page.tsx          # Entrada/Validação
│   │   │   ├── /step1/
│   │   │   │   └── page.tsx
│   │   │   ├── /step2/
│   │   │   │   └── page.tsx
│   │   │   ├── /step3/
│   │   │   │   └── page.tsx
│   │   │   ├── /step4/
│   │   │   │   └── page.tsx
│   │   │   └── /finish/
│   │   │       └── page.tsx
│   │   │
│   │   ├── /dashboard            # 📊 Dashboard RH/Admin
│   │   │   ├── page.tsx          # Lista candidatos
│   │   │   └── /candidate/
│   │   │       └── [id]/
│   │   │           └── page.tsx  # Detalhe candidato
│   │   │
│   │   ├── /settings             # ⚙️ Configurações (Admin)
│   │   │   ├── page.tsx          # Painel principal
│   │   │   ├── /users/
│   │   │   │   └── page.tsx      # CRUD usuários
│   │   │   ├── /backup/
│   │   │   │   └── page.tsx      # Backup/restore
│   │   │   └── /api-panel/
│   │   │       └── page.tsx      # Painel API
│   │   │
│   │   └── /api                  # 🔌 API Routes
│   │       └── /v1/
│   │           ├── /auth/
│   │           ├── /candidates/
│   │           ├── /scores/
│   │           └── /export/
│   │
│   ├── /components               # 🧩 Componentes Reutilizáveis
│   │   ├── /ui/                  # Componentes base
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── /auth/                # Componentes de auth
│   │   │   ├── LoginForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── /form/                # Componentes do formulário
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── AnswerOption.tsx
│   │   │   └── ProgressHeader.tsx
│   │   │
│   │   ├── /dashboard/           # Componentes do dashboard
│   │   │   ├── CandidateCard.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ExportModal.tsx
│   │   │   └── DetailView.tsx
│   │   │
│   │   └── /settings/            # Componentes de configuração
│   │       ├── UserManager.tsx
│   │       ├── BackupTools.tsx
│   │       └── ApiDocs.tsx
│   │
│   ├── /lib                      # 🛠️ Utilitários e Configurações
│   │   ├── supabase.ts           # Cliente Supabase
│   │   ├── auth.ts               # Helpers de autenticação
│   │   ├── scoring.ts            # Lógica de cálculo de score
│   │   ├── profiling.ts          # Geração de perfil
│   │   ├── export.ts             # Funções de exportação
│   │   ├── constants.ts          # Constantes (pesos, perguntas)
│   │   └── utils.ts              # Utilitários gerais
│   │
│   ├── /hooks                    # 🎣 Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useCandidate.ts
│   │   └── useForm.ts
│   │
│   ├── /types                    # 📝 TypeScript Types
│   │   ├── auth.ts
│   │   ├── candidate.ts
│   │   ├── form.ts
│   │   └── api.ts
│   │
│   └── middleware.ts             # 🛡️ Middleware (proteção de rotas)
│
└── /tests                        # 🧪 Testes
    ├── /unit/
    ├── /integration/
    └── /e2e/
```

## Módulos Principais:

### 🔐 **1. Autenticação** (`/src/app/auth/`)
- Login/Register
- Proteção de rotas
- Validação de usuários

### 📋 **2. Formulário** (`/src/app/form/`)
- 4 páginas de perguntas + finalização
- Validação de tentativa única
- Lógica de navegação

### 📊 **3. Dashboard** (`/src/app/dashboard/`)
- Lista de candidatos
- Detalhamento individual
- Exportação de dados

### ⚙️ **4. Configurações** (`/src/app/settings/`)
- CRUD de usuários (Admin only)
- Backup/restore
- Painel de API

### 🔌 **5. API** (`/src/app/api/v1/`)
- Endpoints REST
- Integração externa
- Autenticação por token