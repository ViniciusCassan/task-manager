-- Execução opcional: o Flask-SQLAlchemy cria as tabelas automaticamente
-- (db.create_all()) na primeira vez que a aplicação roda. Este script serve
-- como referência do schema, ou caso você prefira criar as tabelas manualmente.

CREATE DATABASE IF NOT EXISTS todolist_db CHARACTER SET utf8mb4;
USE todolist_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'media',
    status VARCHAR(15) DEFAULT 'pendente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
