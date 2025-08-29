### **Configuração Manual do Banco de Dados**

A tentativa de configurar o esquema do banco de dados automaticamente falhou. O processo requer um login interativo com o GitHub para autenticação, uma ação que não pode ser executada por um sistema automatizado.

Para configurar o seu banco de dados, por favor, siga as instruções manuais abaixo.

---

### **1. Script de Criação do Banco de Dados (SQL)**

O script a seguir define toda a estrutura necessária para o banco de dados do sistema SPAC, incluindo tabelas, tipos de dados, funções e políticas de segurança.

```sql
-- =============================================================================
-- Script de Schema SQL para o Sistema SPAC (Sistema Propósito de Avaliação Comportamental)
-- Plataforma: Supabase (PostgreSQL)
-- Versão: 1.0
--
-- Este script define a estrutura completa do banco de dados, incluindo:
-- 1. Tipos customizados (ENUMs)
-- 2. Criação de tabelas
-- 3. Definição de chaves primárias e estrangeiras
-- 4. Criação de uma função para sincronizar perfis com auth.users
-- 5. Habilitação e configuração de Políticas de Row-Level Security (RLS)
-- =============================================================================

-- Inicia uma transação para garantir que o script seja executado atomicamente.
BEGIN;

-- =============================================================================
-- SEÇÃO 1: TIPOS CUSTOMIZADOS (ENUMs)
-- Definição dos tipos enumerados para padronizar valores em colunas específicas.
-- =============================================================================

-- Descomente as linhas abaixo se precisar recriar os tipos do zero.
-- DROP TYPE IF EXISTS public.user_role;
-- DROP TYPE IF EXISTS public.evaluation_status;

CREATE TYPE public.user_role AS ENUM ('ADMIN_GERAL', 'RH');
CREATE TYPE public.evaluation_status AS ENUM ('concluido', 'em_andamento');

-- =============================================================================
-- SEÇÃO 2: CRIAÇÃO DAS TABELAS
-- Definição das tabelas principais do sistema, seguindo a especificação técnica.
-- A ordem de criação respeita as dependências de chaves estrangeiras.
-- =============================================================================

-- Tabela `perfis`: Armazena dados adicionais dos usuários do sistema (Admin, RH).
-- Vinculada à tabela `auth.users` do Supabase.
CREATE TABLE IF NOT EXISTS public.perfis (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE,
    nome_completo text,
    role public.user_role NOT NULL DEFAULT 'RH'
);
COMMENT ON TABLE public.perfis IS 'Perfis de usuários do sistema (Admin, RH), estendendo auth.users.';

-- Tabela `candidatos`: Armazena os dados de identificação dos candidatos que realizam a avaliação.
CREATE TABLE IF NOT EXISTS public.candidatos (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_completo text NOT NULL,
    email text NOT NULL,
    criado_em timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT nome_email_unico UNIQUE (nome_completo, email)
);
COMMENT ON TABLE public.candidatos IS 'Armazena informações dos candidatos que iniciam a avaliação.';

-- Tabela `perguntas`: Repositório central de todas as perguntas da avaliação.
CREATE TABLE IF NOT EXISTS public.perguntas (
    id serial PRIMARY KEY,
    texto_pergunta text NOT NULL,
    ordem integer NOT NULL,
    pagina integer NOT NULL
);
COMMENT ON TABLE public.perguntas IS 'Estrutura das perguntas exibidas no formulário de avaliação.';

-- Tabela `opcoes_resposta`: Contém todas as alternativas possíveis para cada pergunta.
CREATE TABLE IF NOT EXISTS public.opcoes_resposta (
    id serial PRIMARY KEY,
    pergunta_id integer NOT NULL REFERENCES public.perguntas(id) ON DELETE CASCADE,
    texto_opcao text NOT NULL,
    peso integer NOT NULL DEFAULT 0
);
COMMENT ON TABLE public.opcoes_resposta IS 'Opções de resposta (alternativas) para cada pergunta, com seus respectivos pesos.';

-- Tabela `avaliacoes`: Registra cada sessão de avaliação iniciada por um candidato.
CREATE TABLE IF NOT EXISTS public.avaliacoes (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    candidato_id uuid NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
    status public.evaluation_status NOT NULL DEFAULT 'em_andamento',
    finalizado_em timestamptz
);
COMMENT ON TABLE public.avaliacoes IS 'Registra uma instância de avaliação de um candidato.';

-- Tabela `respostas_candidato`: Armazena cada resposta individual selecionada pelo candidato.
CREATE TABLE IF NOT EXISTS public.respostas_candidato (
    id bigserial PRIMARY KEY,
    avaliacao_id uuid NOT NULL REFERENCES public.avaliacoes(id) ON DELETE CASCADE,
    opcao_id integer NOT NULL REFERENCES public.opcoes_resposta(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.respostas_candidato IS 'Respostas específicas fornecidas por um candidato em uma avaliação.';

-- Tabela `resultados`: Consolida o resultado final de uma avaliação, incluindo score e perfil.
CREATE TABLE IF NOT EXISTS public.resultados (
    id uuid NOT NULL PRIMARY KEY,
    avaliacao_id uuid NOT NULL UNIQUE REFERENCES public.avaliacoes(id) ON DELETE CASCADE,
    score_final integer,
    classificacao text,
    perfil_json jsonb
);
COMMENT ON TABLE public.resultados IS 'Resultados consolidados, score e perfil gerado após a conclusão da avaliação.';

-- =============================================================================
-- SEÇÃO 3: FUNÇÕES E TRIGGERS (AUTOMAÇÃO)
-- Automatiza a criação de um perfil de usuário quando um novo registro é adicionado em `auth.users`.
-- =============================================================================

-- Função para criar um novo registro em `public.perfis`
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.perfis (id, email, nome_completo, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'nome_completo', 'RH'); -- Define RH como padrão
  RETURN new;
END;
$$;
COMMENT ON FUNCTION public.handle_new_user() IS 'Cria automaticamente um perfil de usuário ao registrar um novo usuário em auth.users.';

-- Trigger que aciona a função `handle_new_user` após a criação de um usuário.
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- SEÇÃO 4: ROW-LEVEL SECURITY (RLS)
-- Habilita RLS e define políticas para controlar o acesso aos dados.
-- =============================================================================

-- Habilita RLS para todas as tabelas
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opcoes_resposta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respostas_candidato ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resultados ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Políticas para a tabela `perfis`
-- -----------------------------------------------------------------------------
CREATE POLICY "Usuários podem ver seu próprio perfil."
ON public.perfis FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil."
ON public.perfis FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins podem gerenciar todos os perfis."
ON public.perfis FOR ALL
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ADMIN_GERAL'
)
WITH CHECK (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ADMIN_GERAL'
);

-- -----------------------------------------------------------------------------
-- Políticas para as tabelas `perguntas` e `opcoes_resposta` (Dados públicos da avaliação)
-- -----------------------------------------------------------------------------
CREATE POLICY "Qualquer pessoa pode ler as perguntas e opções."
ON public.perguntas FOR SELECT
USING (true);

CREATE POLICY "Qualquer pessoa pode ler as perguntas e opções."
ON public.opcoes_resposta FOR SELECT
USING (true);

CREATE POLICY "Admins podem gerenciar perguntas e opções."
ON public.perguntas FOR ALL
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ADMIN_GERAL'
);

CREATE POLICY "Admins podem gerenciar perguntas e opções."
ON public.opcoes_resposta FOR ALL
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ADMIN_GERAL'
);


-- -----------------------------------------------------------------------------
-- Políticas para `candidatos`, `avaliacoes`, `respostas_candidato` (Fluxo do Candidato)
-- -----------------------------------------------------------------------------
CREATE POLICY "Candidatos (anônimos) podem criar seus registros."
ON public.candidatos FOR INSERT
WITH CHECK (true);

CREATE POLICY "Candidatos (anônimos) podem criar avaliações."
ON public.avaliacoes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Candidatos (anônimos) podem inserir suas respostas."
ON public.respostas_candidato FOR INSERT
WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- Políticas para `candidatos`, `avaliacoes`, `respostas`, `resultados` (Acesso do Painel)
-- -----------------------------------------------------------------------------
CREATE POLICY "RH e Admins podem visualizar dados dos candidatos e avaliações."
ON public.candidatos FOR SELECT
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) IN ('ADMIN_GERAL', 'RH')
);

CREATE POLICY "RH e Admins podem visualizar dados dos candidatos e avaliações."
ON public.avaliacoes FOR SELECT
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) IN ('ADMIN_GERAL', 'RH')
);

CREATE POLICY "RH e Admins podem visualizar dados dos candidatos e avaliações."
ON public.respostas_candidato FOR SELECT
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) IN ('ADMIN_GERAL', 'RH')
);

CREATE POLICY "RH e Admins podem visualizar dados dos candidatos e avaliações."
ON public.resultados FOR SELECT
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) IN ('ADMIN_GERAL', 'RH')
);

-- Políticas de Modificação (Mais restritivas)
CREATE POLICY "Admins podem gerenciar todos os dados de candidatos e resultados."
ON public.candidatos FOR ALL
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ADMIN_GERAL'
);

CREATE POLICY "Admins podem gerenciar todos os dados de candidatos e resultados."
ON public.avaliacoes FOR ALL
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ADMIN_GERAL'
);

CREATE POLICY "Admins podem gerenciar todos os dados de candidatos e resultados."
ON public.respostas_candidato FOR ALL
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ADMIN_GERAL'
);

CREATE POLICY "Admins podem gerenciar todos os dados de candidatos e resultados."
ON public.resultados FOR ALL
USING (
  (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ADMIN_GERAL'
);

-- Finaliza a transação, aplicando todas as mudanças.
COMMIT;

```

---

### **2. Instruções para Execução**

Siga estes passos para criar as tabelas e configurar seu banco de dados no Supabase.

1.  **Acesse o seu projeto Supabase:**
    Clique no link a seguir para abrir o painel do seu projeto: [https://app.supabase.com/project/zibuyabpsvgulvigvdtb](https://app.supabase.com/project/zibuyabpsvgulvigvdtb)

2.  **Navegue até o SQL Editor:**
    No menu lateral esquerdo, clique no ícone de banco de dados e, em seguida, selecione **SQL Editor**.
    

3.  **Cole o Script:**
    Na janela do editor de SQL, cole o script completo fornecido na **Seção 1** deste documento.

4.  **Execute o Script:**
    Clique no botão **RUN** (ou pressione `Ctrl+Enter` / `Cmd+Enter`) para executar o script. Ao final, você deverá ver uma mensagem de "Success. No rows returned".