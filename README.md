# To-Do List — Gerenciador de Tarefas

Aplicação full-stack de gerenciamento de tarefas com autenticação de usuários.

**Stack:** Python (Flask) + MySQL + HTML/CSS/JavaScript

## Funcionalidades

- Cadastro e login de usuários (senhas criptografadas com hash)
- CRUD completo de tarefas (criar, listar, editar status, excluir)
- Tarefas isoladas por usuário
- Descrição, prioridade (baixa/média/alta) e data de prazo por tarefa
- Filtro por status (todas / pendentes / concluídas)
- Front-end dinâmico consumindo uma API REST via `fetch`

## Estrutura do projeto

```
task-manager/
├── app/
│   ├── __init__.py          # cria e configura a aplicação Flask
│   ├── models.py             # modelos: User e Task (SQLAlchemy)
│   ├── routes/
│   │   ├── auth.py           # login, cadastro, logout
│   │   └── tasks.py          # página principal + API REST de tarefas
│   ├── templates/             # HTML (Jinja2)
│   └── static/
│       ├── css/style.css
│       └── js/script.js       # lógica do front-end (fetch para a API)
├── run.py                    # ponto de entrada da aplicação
├── requirements.txt
├── schema_mysql.sql          # schema de referência
└── .env.example
```

## Como rodar

### 1. Instale as dependências

```bash
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure o banco de dados

Por padrão o projeto usa SQLite (arquivo `todolist.db`, criado automaticamente).

Para usar MySQL:

1. Crie o banco:
```sql
   CREATE DATABASE task_manager_db CHARACTER SET utf8mb4;
```
2. Copie `.env.example` para `.env` e preencha:
```
   DATABASE_URL=mysql+pymysql://usuario:senha@localhost/task_manager_db
   SECRET_KEY=troque-por-uma-chave-aleatoria
```

### 3. Rode a aplicação

```bash
python run.py
```

Acesse `http://127.0.0.1:5000`.

## Melhorias futuras

- Edição de tarefas já criadas
- Categorias/tags
- Notificações de prazo
- Deploy em produção
- Testes automatizados (pytest)