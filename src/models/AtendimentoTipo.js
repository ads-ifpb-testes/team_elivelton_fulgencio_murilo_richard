const { conn, connTest } = require('../db');

async function create(data, test) {
  const sql = `
  INSERT INTO 
    atendimentoTipo (id, tipo) 
  VALUES 
    (?, ?)
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const { id, tipo } = data;

  const { lastID } = await db.run(sql, [id, tipo]);

  return lastID;
}

async function readAll(test) {
  const sql = `
    SELECT
      *
    FROM
      atendimentoTipo
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const tipos = await db.all(sql);

  return tipos;
}

async function readById(id, test) {
  const sql = `
    SELECT
      *
    FROM
      atendimentoTipo
    WHERE
      id=?
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const tipos = await db.get(sql, id);

  return tipos;
}

async function readByType(tipo, test) {
  const sql = `
    SELECT
      *
    FROM
      atendimentoTipo
    WHERE
      tipo=?
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const tipos = await db.get(sql, tipo);

  return tipos;
}

async function update(id, data, test) {
  const sql = `
    UPDATE
      atendimentoTipo
    SET
      tipo = ?
    WHERE
      id = ?
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const { tipo } = data;

  const { changes } = await db.run(sql, [tipo, id]);

  return changes;
}

async function destroy(id, test) {
  const sql = `
    DELETE FROM
      atendimentoTipo
    WHERE
      id = ?
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const { lastID } = await db.run(sql, [id]);

  return lastID;
}

module.exports = { create, readAll, readById, update, destroy, readByType };
