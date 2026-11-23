-- db/schema.sql — base de datos de ms-conductores
SET NAMES utf8mb4;

CREATE TABLE conductores (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  nombre_conductor     VARCHAR(100) NOT NULL,
  licencia             VARCHAR(20) NOT NULL,
  licencia_vigente     BOOLEAN NOT NULL
);

INSERT INTO conductores (nombre_conductor, licencia, licencia_vigente) VALUES
  ('Carlos Mosquera', 'C2-445566', TRUE),
  ('Diana Lasso', 'C2-778899', TRUE),
  ('Óscar Riascos', 'C2-112233', FALSE),
  ('Nidia Perea', 'C3-998877', TRUE);
