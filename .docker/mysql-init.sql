CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (first_name, last_name, email, password_hash)
VALUES ('assaf', 'balzamovich', 'assaf@gotech.io', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');

INSERT INTO users (first_name, last_name, email, password_hash)
VALUES ('doron', 'feldman', 'doron@gotech.io', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');