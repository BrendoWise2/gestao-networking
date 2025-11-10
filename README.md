Plataforma de Gestão de Networking (Teste Técnico)
Este é um projeto Fullstack desenvolvido como parte do teste técnico para a vaga de Desenvolvedor(a) Fullstack. O objetivo é criar uma plataforma para gestão de membros, indicações e performance de um grupo de networking, substituindo controles manuais.


A arquitetura completa e o planejamento da solução estão detalhados no arquivo DOCUMENTO_ARQUITETURA.md.

Stack Utilizada

Frontend: Next.js (com App Router), React e TypeScript.

Estilização: SCSS Modules.

Backend: Next.js (API Routes) e Node.js.

Banco de Dados: PostgreSQL.

ORM: Prisma.

Validação: Zod.


Como Rodar o Projeto
Siga os passos abaixo para rodar o projeto localmente.

1. Pré-requisitos
Node.js (v18 ou superior)

Yarn (ou npm/pnpm)

Um servidor PostgreSQL.

2. Instalação
Bash

# 1. Clone o repositório
git clone https://github.com/BrendoWise2/gestao-networking.git
cd gestao-networking

# 2. Instale as dependências
yarn install
3. Configuração do Banco de Dados
Crie um banco de dados PostgreSQL. Para este projeto, o nome sugerido é gestao-networking.

Na raiz do projeto, renomeie o arquivo .env.example para .env ou crie um novo arquivo .env.

Adicione as seguintes variáveis de ambiente ao arquivo .env:

Snippet de código

# String de conexão do seu banco PostgreSQL
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/gestao-networking?schema=public"

# Chave secreta para acessar as rotas de admin
ADMIN_SECRET="uma chave secreta"

# URL base do seu projeto (para os links de convite)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
4. Rodar a Aplicação
Bash

# 1. Aplique as migrações no banco de dados
# (Isso criará todas as tabelas)
yarn prisma migrate dev

# 2. Inicie o servidor de desenvolvimento
yarn dev
A aplicação estara disponível em http://localhost:3000.

Como Testar o Fluxo Obrigatório

Passo 1: Criar uma Intenção (Visitante)
Acesse o formulário público: http://localhost:3000/intencao

Preencha os dados de um candidato (ex: "Candidato Teste") e envie.

Passo 2: Aprovar a Intenção (Admin)
Acesse a página de admin: http://localhost:3000/admin

O navegador pedirá uma senha (prompt). Cole o valor da sua ADMIN_SECRET (que está no .env).

Você verá a lista de intenções. Encontre o "Candidato Teste" e clique em Aprovar.

O status na tela mudará para "APPROVED".

Passo 3: Pegar o Link do Convite
Olhe o terminal onde o yarn dev está rodando.

Uma simulação de envio de e-mail aparecerá no console, contendo o link de convite:

SIMULAÇÃO DE ENVIO DE E-MAIL
Link de Convite para ...:
http://localhost:3000/convite/token-secreto-aleatorio...
Copie este link completo.

Passo 4: Finalizar o Cadastro (Novo Membro)
Cole o link de convite no seu navegador.

A página "Finalize seu Cadastro" irá carregar.

Os campos "Nome" e "Email" virão pré-preenchidos.

Crie uma senha (mín. 6 caracteres) e clique em "Finalizar Cadastro".

Você verá a mensagem de sucesso.

Teste extra: Recarregue a página do convite. Você deverá ver a mensagem "Convite já utilizado", provando que o token foi invalidado.

Módulo Opcional: Dashboard
Acesse a página de dashboard: http://localhost:3000/admin/dashboard

Autentique-se com a ADMIN_SECRET (se pedir).

Os indicadores de performance (mockados) serão exibidos.

Rodando os Testes
Para rodar os testes unitários e de integração (Jest):

Bash

yarn test
