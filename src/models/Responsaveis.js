const { conn } = require("../db");

async function create(data) {
  const sql = `
  INSERT INTO 
    responsaveis (nome, funcao, telefone, email, senha, id) 
  VALUES 
    (?, ?, ?, ?, ?, ?)
  `;

  const db = await conn();

  const { nome, funcao, telefone, email, senha, id } = data;

  const { lastID } = await db.run(sql, [nome, funcao, telefone, email, senha, id]);

  return lastID;
}

async function readAll() {
  const sql = `
    SELECT
      id,
      nome,
      funcao,
      telefone,
      email
    FROM
      responsaveis
    WHERE
      id <> 0
  `;

  const db = await conn();

  const responsaveis = await db.all(sql);

  return responsaveis;
}

async function readById(id) {
  const sql = `
    SELECT
    *
    FROM
      responsaveis
    WHERE
      id=? AND id <> 0
  `;

  const db = await conn();

  const responsaveis = await db.get(sql, id);

  return responsaveis;
}

async function search(nome) {
  nome = `%${nome}%`;
  const sql = `
    SELECT
      id,
      nome,
      funcao,
      telefone,
      email
    FROM
      responsaveis
    WHERE
      nome LIKE ? AND id <> 0
  `;

  const db = await conn();

  const responsaveis = await db.all(sql, nome);

  return responsaveis;
}

async function readByEmail(email) {
  const sql = `
    SELECT
      *
    FROM
      responsaveis
    WHERE
      email=? AND id <> 0
  `;

  const db = await conn();

  const responsaveis = await db.get(sql, email);

  return responsaveis;
}

async function update(id, data) {
  const sql = `
    UPDATE
      responsaveis
    SET
      nome = ?, funcao = ?, telefone = ?, email = ?, senha = ?
    WHERE
      id = ? AND id <> 0
  `;

  const db = await conn();

  const { nome, funcao, telefone, email, senha } = data;

  const { changes } = await db.run(sql, [nome, funcao, telefone, email, senha, id]);

  return changes;
}

async function destroy(id) {
  const sql = `
    DELETE FROM
      responsaveis
    WHERE
      id = ? AND id <> 0
  `;

  const db = await conn();

  const { lastID } = await db.run(sql, [id]);

  return lastID;
}

async function readByName(nome) {
  nome = `%${nome}%`;
  const sql = `
    SELECT
      nome, id
    FROM
      responsaveis
    WHERE
      nome LIKE ? AND id <> 0
    LIMIT 5
  `;

  const db = await conn();

  const responsaveis = await db.all(sql, nome);

  return responsaveis;
}

async function readFirst5() {
  const sql = `
    SELECT
      nome, id
    FROM
      responsaveis
    WHERE
      id <> 0
    LIMIT 5
  `;

  const db = await conn();

  const responsaveis = await db.all(sql);

  return responsaveis;
}

module.exports = {
  create,
  readAll,
  readById,
  readByEmail,
  update,
  destroy,
  readByName,
  readFirst5,
  search,
};
