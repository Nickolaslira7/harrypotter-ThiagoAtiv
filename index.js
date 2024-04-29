const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "aulaback",
    password: "ds564",
    port: 7007,
});

app.get("/", async (req, res) => {
    res.status(200).send({ mensagem: "Servidor backend rodando com sucesso🚀" });
});

app.get("/bruxo", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM bruxo");
        res.status(200).send({
            total: rows.length,
            bruxos: rows,
        });
    }
    catch (error) {
        console.error("Erro ao buscar bruxos", error);
        res.status(500).send("Erro ao buscar bruxos");
    }
});

app.get("/bruxo/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const { rows } = await pool.query('SELECT * FROM bruxo WHERE id = $1', [id]);
  
      if (rows.length === 0) {
        res.status(404).send('Bruxo não encontrado');
        return;
      }
  
      res.status(200).send(rows[0]);
    } catch (err) {
      console.error('Erro ao buscar bruxo:', err);
      res.status(500).send('Erro ao buscar bruxo');
    }
});

app.post("/bruxo", async (req, res) => {
    const { nome, idade, habilidade, patrono, varinha_id, casa, tipo_sanguineo } = req.body;
    const casaValida = verificaCasa(casa);
    const tipoSanguineoValido = verificaTipoSanguineo(tipo_sanguineo);
  
    if (!casaValida || !tipoSanguineoValido) {
        res.status(400).send('Casa ou tipo sanguíneo inválido');
        return;
    }
  
    try {
        const result = await pool.query(
            'INSERT INTO bruxo (nome, idade, casa, habilidade, tipo_sanguinio, patrono, varinha_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nome, idade, casaValida, habilidade, tipoSanguineoValido, patrono, varinha_id]
        );
  
        res.status(201).json({
            message: 'Bruxo inserido com sucesso',
            bruxo: result.rows[0],
        });
    } catch (err) {
        console.error('Erro ao inserir novo bruxo:', err);
        res.status(500).send('Erro ao inserir novo bruxo');
    }
});


app.put("/bruxo/:id", async (req, res) => {
        const { id } = req.params;
        const { nome, idade, habilidade, patrono, varinha_id } = req.body;
        const casaValida = verificaCasa(req.body.casa);
        const tipoSanguineoValido = verificaTipoSanguineo(req.body.tipo_sanguineo);
      
        try {
          const result = await pool.query(
            'UPDATE bruxo SET nome = $1, idade = $2, casa = $3, habilidade = $4, tipo_sanguinio = $5, patrono = $6, varinha_id = $7 WHERE id = $8 RETURNING *',
            [nome, idade, casaValida, habilidade, tipoSanguineoValido, patrono, varinha_id, id]
          );
      
          res.status(200).json({
            message: 'Bruxo atualizado com sucesso',
            bruxo: result.rows[0],
          });
        } catch (err) {
          console.error('Erro ao atualizar bruxo:', err);
          res.status(500).send('Erro ao atualizar bruxo');
        }
});

app.delete("/bruxo/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM bruxo WHERE id = $1', [id]);
  
      if (result.rowCount === 0) {
        res.status(404).send('Bruxo não encontrado');
        return;
      }
  
      res.status(200).send('Bruxo excluído com sucesso');
    } catch (err) {
      console.error('Erro ao excluir bruxo:', err);
      res.status(500).send('Erro ao excluir bruxo');
    }
});

app.get("/varinha", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM varinha");
        res.status(200).send({
            total: rows.length,
            varinhas: rows,
        });
    }
    catch (error) {
        console.error("Erro ao buscar varinhas", error);
        res.status(500).send("Erro ao buscar varinhas");
    }
});

app.get("/varinha/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const { rows } = await pool.query('SELECT * FROM varinha WHERE id = $1', [id]);
  
      if (rows.length === 0) {
        res.status(404).send('Varinha não encontrada');
        return;
      }
  
      res.status(200).send(rows[0]);
    } catch (err) {
      console.error('Erro ao buscar varinha:', err);
      res.status(500).send('Erro ao buscar varinha');
    }
});

app.post("/varinha", async (req, res) => {
    const { tamanho, material, data_de_fabricacao } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO varinha (tamanho, material, data_de_fabricacao) VALUES ($1, $2, $3) RETURNING *',
        [tamanho, material, data_de_fabricacao]
      );
  
      res.status(201).json({
        message: 'Varinha inserida com sucesso',
        varinha: result.rows[0],
      });
    } catch (err) {
      console.error('Erro ao inserir nova varinha:', err);
      res.status(500).send('Erro ao inserir nova varinha');
    }
});

app.put("/varinha/:id", async (req, res) => {
    const { id } = req.params;
    const { tamanho, material, data_de_fabricacao } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE varinha SET tamanho = $1, material = $2, data_de_fabricacao = $3 WHERE id = $4 RETURNING *',
        [tamanho, material, data_de_fabricacao, id]
      );
  
      res.status(200).json({
        message: 'Varinha atualizada com sucesso',
        varinha: result.rows[0],
      });
    } catch (err) {
      console.error('Erro ao atualizar varinha:', err);
      res.status(500).send('Erro ao atualizar varinha');
    }
});

app.delete("/varinha/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM varinha WHERE id = $1', [id]);
  
      if (result.rowCount === 0) {
        res.status(404).send('Varinha não encontrada');
        return;
      }
  
      res.status(200).send('Varinha excluída com sucesso');
    } catch (err) {
      console.error('Erro ao excluir varinha:', err);
      res.status(500).send('Erro ao excluir varinha');
    }
  });


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀🚀`);
});

const verificaCasa = (casa) => {
    if (casa === "Grifinoria" || casa === "Sonserina" || casa === "Corvinal" || casa === "Lufa-Lufa") {
        return casa;
    } else {
        return null;
    }
};


const verificaTipoSanguineo = (tipo_sanguineo) => {
    if (tipo_sanguineo === "Puro" || tipo_sanguineo === "Mestico" || tipo_sanguineo === "Trouxa") {
        return tipo_sanguineo;
    } else {
        return null;
    }
};
