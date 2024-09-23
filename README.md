# Knowledge C0d3r

Este é o repositório do projeto **Knowledge C0d3r**, um sistema de gerenciamento e compartilhamento de conhecimento, desenvolvido com Vue.js no front-end e Node.js no back-end. 
O projeto utiliza PostgreSQL como banco de dados e Knex.js para gerenciamento das migrations.

## Documentação da API

A documentação da API está disponível via Swagger e pode ser acessada em:
**http://localhost:3000/api-docs**

## Requisitos

- [Node.js 16](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [PostgreSQL 13+](https://www.postgresql.org/)

## Instruções para iniciar o projeto

### Passos para rodar localmente

1. **Clone o repositório**:

    ```bash
    git clone https://github.com/hnrqb/knowledge-c0d3r.git
    cd knowledge-c0d3r
    ```

3. **Instale o PostgreSQL** (caso não tenha instalado):  
    - Baixe e instale o PostgreSQL a partir do site oficial: [PostgreSQL](https://www.postgresql.org/download/).
    - Após a instalação, crie um banco de dados:

      ```
      createdb knowledge_c0d3r_db
      ```

4. **Configure o arquivo `.env`**:
    - Crie um arquivo `.env` baseado no arquivo de exemplo `env_example`.
    - Preencha as variáveis de ambiente com suas credenciais de banco de dados PostgreSQL e outros valores necessários.

5. **Instale as dependências do front-end**:

    ```bash
    cd frontend
    npm install
    ```

7. **Instale as dependências do back-end**:

    ```bash
    cd ../backend
    npm install
    ```

9. **Execute as migrations do banco de dados**:
    - No diretório `backend`, execute o comando para criar as tabelas necessárias:
    
      ```bash
      knex migrate:latest
      ```

10. **Inicie o front-end**:
    - No diretório `frontend`, execute:
    
      ```bash
      npm run serve
      ```

    O front-end estará disponível em `http://localhost:8080`.

11. **Inicie o back-end**:
    - No diretório `backend`, execute:
    
      ```bash
      npm start
      ```

    O back-end estará rodando em `http://localhost:3000`.
