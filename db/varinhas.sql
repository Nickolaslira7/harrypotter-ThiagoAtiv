CREATE TABLE varinha (
    id SERIAL PRIMARY KEY,
    tamanho INT NOT NULL,
    material VARCHAR(255) NOT NULL,
    data_de_fabricacao DATE NOT NULL
);