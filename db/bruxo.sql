CREATE TABLE bruxo (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    idade INT NOT NULL,
    casa VARCHAR(255) NOT NULL,
    habilidade VARCHAR(255) NOT NULL,
    tipo_sanguinio VARCHAR(255) NOT NULL,
    patrono VARCHAR(255),
    varinha_id INT,
    FOREIGN KEY (varinha_id) REFERENCES varinha(id)
);

INSERT INTO bruxo (nome, idade, casa, habilidade, tipo_sanguinio, patrono, varinha_id)
VALUES ('Harry Potter', 17, 'Grifinória', 'Apanhador', 'Mestiço', 'Cervo', 2);