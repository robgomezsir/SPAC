# Guia de Deploy: Publicação e Implantação do Projeto SPAC

Este documento fornece um guia completo para publicar o código-fonte da aplicação SPAC no GitHub e, em seguida, realizar o deploy contínuo utilizando a plataforma Vercel.

---

## **Seção 1: Publicando o Código no GitHub**

Antes de realizar o deploy, o código do seu projeto precisa ser versionado e hospedado em um repositório Git remoto. Siga os passos abaixo para enviar seu projeto local para o GitHub.

### **1. Inicialize o Repositório Git Local**

Abra o terminal na pasta raiz do seu projeto e execute o comando para inicializar um novo repositório Git.

```sh
git init
```
> **Análise:** Este comando cria um subdiretório oculto `.git` na pasta do seu projeto, que contém todos os arquivos de metadados e configuração necessários para o Git começar a rastrear as alterações no código.

### **2. Adicione os Arquivos ao Stage**

Adicione todos os arquivos e pastas do projeto à área de "staging" do Git, preparando-os para o primeiro commit.

```sh
git add .
```
> **Análise:** O comando `git add .` rastreia todos os arquivos e diretórios (a partir do local atual) que não estão explicitamente ignorados por um arquivo `.gitignore`. Esta é a forma mais comum de preparar um projeto inteiro para ser salvo no histórico de versões.

### **3. Realize o Primeiro Commit**

"Comite" os arquivos que estão em *stage* para o histórico do repositório local. Este commit serve como um snapshot inicial do seu projeto.

```sh
git commit -m "Initial commit of SPAC application"
```
> **Análise:** Um commit é um ponto de salvamento permanente no histórico do seu projeto. A mensagem (`-m`) é crucial para a documentação, pois explica o que foi alterado. "Initial commit" é uma convenção para o primeiro commit de um projeto.

### **4. Conecte ao Repositório Remoto do GitHub**

Associe seu repositório local ao repositório remoto que você criou no GitHub. Isso diz ao Git para onde enviar (push) suas alterações.

```sh
git remote add origin https://github.com/robgomezsir/SPAC.git
```
> **Análise:** O comando `git remote add` cria uma conexão. `origin` é o nome padrão (alias) para a URL do repositório remoto. Isso simplifica comandos futuros, permitindo que você use `origin` em vez da URL completa.

### **5. Envie o Código para o GitHub**

Envie o conteúdo do seu branch `main` local para o repositório remoto `origin`.

```sh
git push -u origin main
```
> **Análise:** O comando `git push` envia seus commits para o repositório remoto. A flag `-u` (ou `--set-upstream`) cria um vínculo entre seu branch `main` local e o branch `main` remoto. Após este primeiro push, você poderá usar apenas `git push` para enviar futuras alterações.

---

## **Seção 2: Deploy da Aplicação na Vercel**

Com o código no GitHub, o deploy na Vercel é um processo simplificado que se integra diretamente ao seu repositório, automatizando o build e a publicação.

### **1. Crie uma Conta e Importe o Projeto**

1.  Acesse o site da **[Vercel](https://vercel.com)** e clique em **Sign Up**. É altamente recomendável se cadastrar usando sua conta do **GitHub** para uma integração automática.
2.  Após o login, no seu dashboard, clique em **Add New...** e selecione a opção **Project**.
3.  A Vercel solicitará acesso aos seus repositórios do GitHub. Autorize o acesso e, na lista de repositórios, encontre e selecione `robgomezsir/SPAC`. Clique em **Import**.

### **2. Configure as Variáveis de Ambiente**

Durante o processo de importação, a Vercel detectará que seu projeto é um aplicativo Next.js. Antes de iniciar o deploy, expanda a seção **Environment Variables**. Adicione as seguintes chaves e valores para conectar a aplicação ao backend do Supabase.

> **⚠️ Atenção:** As variáveis de ambiente são sensíveis. A `SUPABASE_SERVICE_ROLE_KEY` concede acesso administrativo total ao seu banco de dados e nunca deve ser exposta no lado do cliente (`NEXT_PUBLIC_`).

| Chave (Key) | Valor (Value) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zibuyabpsvgulvigvdtb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYnV5YWJwc3ZndWx2aWd2ZHRiIiwicm9sZSI6ImFub24iLCJiYXQiOjE3NTYxNzQ3NjUsImV4cCI6MjA3MTc1MDc2NX0.a1EoCpinPFQqBd_ZYOT7n7iViH3NCwIzldzcBLlvfNo` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYnV5YWJwc3ZndWx2aWd2ZHRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE3NDc2NSwiZXhwIjoyMDcxNzUwNzY1fQ.PzB6anXBL41uxSGgGppVhoZGMVRvBqtWYfSVzGOBXQ` |

### **3. Inicie o Processo de Deploy**

1.  Após inserir as variáveis de ambiente, clique no botão **Deploy**.
2.  A Vercel iniciará o processo de build: ela instalará as dependências (`npm install`), construirá o projeto (`next build`) e o implantará em sua infraestrutura global de CDN.
3.  Você pode acompanhar o progresso em tempo real através dos logs de build.

### **4. Acesse e Configure o Domínio**

1.  Após o deploy bem-sucedido, você verá uma tela de confirmação com um screenshot da sua aplicação. Clique em **Continue to Dashboard**.
2.  No dashboard do seu projeto, navegue até a aba **Domains**.

#### **Domínio Padrão da Vercel**
- A Vercel automaticamente atribui um domínio para sua aplicação, geralmente no formato `[nome-do-projeto].vercel.app` (ex: `spac.vercel.app`). Este domínio já está ativo e pronto para uso.

#### **Configurando um Domínio Personalizado (ex: `spac.com`)**
- **Aquisição do Domínio:** Primeiro, você precisa comprar um nome de domínio de um registrador, como GoDaddy, Namecheap, ou Google Domains.
- **Adição na Vercel:** Na aba **Domains**, insira o seu domínio personalizado (ex: `spac.com`) e clique em **Add**.
- **Configuração de DNS:** A Vercel fornecerá as instruções de configuração. Geralmente, você precisará ir ao painel do seu registrador de domínio e atualizar os registros DNS para apontar para os servidores da Vercel (seja alterando os Nameservers ou adicionando um registro A/CNAME).
- **Propagação:** Após salvar as alterações de DNS, pode levar de alguns minutos a várias horas para que as mudanças se propaguem pela internet. A Vercel cuidará automaticamente da emissão do certificado SSL (HTTPS) para o seu domínio personalizado.