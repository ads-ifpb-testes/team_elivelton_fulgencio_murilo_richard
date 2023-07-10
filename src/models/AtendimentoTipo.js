const { conn } = require("../db");

async function create(data) {
  const sql = `
  INSERT INTO 
    atendimentoTipo (id, tipo) 
  VALUES 
    (?, ?)
  `;

  const db = await conn();

  const { id, tipo } = data;

  const { lastID } = await db.run(sql, [id, tipo]);

  return lastID;
}

async function readAll() {
  const sql = `
    SELECT
      *
    FROM
      atendimentoTipo
  `;

  const db = await conn();

  const tipos = await db.all(sql);

  return tipos;
}

async function readById(id) {
  const sql = `
    SELECT
      *
    FROM
      atendimentoTipo
    WHERE
      id=?
  `;

  const db = await conn();

  const tipos = await db.get(sql, id);

  return tipos;
}

async function readByType(tipo) {
  const sql = `
    SELECT
      *
    FROM
      atendimentoTipo
    WHERE
      tipo=?
  `;

  const db = await conn();

  const tipos = await db.get(sql, tipo);

  return tipos;
}

async function update(id, data) {
  const sql = `
    UPDATE
      atendimentoTipo
    SET
      tipo = ?
    WHERE
      id = ?
  `;

  const db = await conn();

  const { tipo } = data;

  const { changes } = await db.run(sql, [tipo, id]);

  return changes;
}

async function destroy(id) {
  const sql = `
    DELETE FROM
      atendimento
    WHERE
      id = ?
  `;

  const db = await conn();

  const { lastID } = await db.run(sql, [id]);

  return lastID;
}

module.exports = { create, readAll, readById, update, destroy, readByType };
