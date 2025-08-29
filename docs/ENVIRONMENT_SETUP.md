# 🌍 Configuração de Ambiente - SPAC

## **📋 Visão Geral**

Este documento explica como configurar as variáveis de ambiente para a aplicação SPAC usando o arquivo `env.example`.

## **🚀 Configuração Rápida**

### **1. Desenvolvimento Local:**
```bash
# Copiar env.example para .env.local
npm run setup:env

# Iniciar com ambiente configurado
npm run dev:env
```

### **2. Build com Ambiente:**
```bash
# Build com ambiente configurado
npm run build:env
```

### **3. Produção com Ambiente:**
```bash
# Iniciar produção com ambiente configurado
npm run start:env
```

## **🔧 Configuração Manual**

### **Passo 1: Copiar o arquivo de exemplo**
```bash
# Windows (PowerShell)
Copy-Item env.example .env.local

# Linux/Mac
cp env.example .env.local
```

### **Passo 2: Editar as variáveis necessárias**
```bash
# Abrir o arquivo .env.local
code .env.local
```

### **Passo 3: Configurar credenciais específicas**
- **Supabase:** Já configurado no env.example
- **Email:** Configurar SMTP se necessário
- **Segurança:** Gerar chaves únicas para produção

## **📁 Estrutura do env.example**

### **🔐 Supabase (OBRIGATÓRIO)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://zibuyabpsvgulvigvdtb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **🌐 Aplicação**
```bash
NEXT_PUBLIC_APP_NAME=SPAC
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **🔑 Autenticação**
```bash
NEXTAUTH_SECRET=spac-dev-secret-key-2024
NEXTAUTH_URL=http://localhost:3000
```

### **🗄️ Banco de Dados**
```bash
DATABASE_URL=postgresql://postgres:[password]@db.zibuyabpsvgulvigvdtb.supabase.co:5432/postgres
```

### **📧 Email (OPCIONAL)**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

### **🛡️ Segurança**
```bash
JWT_SECRET=spac-jwt-secret-key-2024
ENCRYPTION_KEY=spac-32-char-encryption-key-2024
```

## **⚙️ Scripts Disponíveis**

| Script | Descrição |
|--------|-----------|
| `npm run setup:env` | Copia env.example para .env.local |
| `npm run dev:env` | Inicia dev com ambiente configurado |
| `npm run build:env` | Build com ambiente configurado |
| `npm run start:env` | Inicia produção com ambiente configurado |
| `npm run clean:env` | Remove .env.local |

## **🔒 Segurança**

### **⚠️ IMPORTANTE:**
- **NUNCA** commite o arquivo `.env.local` no Git
- **SEMPRE** use o `env.example` como template
- **GERE** chaves únicas para produção
- **ROTACIONE** chaves regularmente

### **🔄 Rotação de Chaves:**
1. Atualize as chaves no Supabase
2. Atualize o `env.example`
3. Distribua o novo `env.example` para a equipe
4. Cada desenvolvedor copia para `.env.local`

## **🚨 Troubleshooting**

### **Problema: "Variáveis de ambiente não configuradas"**
**Solução:** Execute `npm run setup:env`

### **Problema: "Erro de conexão com Supabase"**
**Solução:** Verifique as credenciais no `.env.local`

### **Problema: "Página branca"**
**Solução:** Verifique se o `.env.local` existe e está correto

### **Problema: "Erro de build"**
**Solução:** Execute `npm run build:env`

## **📚 Referências**

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Environment Setup](https://supabase.com/docs/guides/getting-started/environment-variables)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)

---

**Responsável:** Equipe de Desenvolvimento SPAC  
**Data:** Dezembro 2024  
**Versão:** 1.0
