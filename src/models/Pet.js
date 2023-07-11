const { conn } = require("../db");

async function create(data) {
  for (const campo in data){
    if(data[campo].length<1){
      return -1;
    }
  }
  const sql = `
  INSERT INTO 
    pets (nome, tutor, telefone, endereco, id) 
  VALUES 
    (?, ?, ?, ?, ?)
  `;

  const db = await conn();

  const { nome, tutor, telefone, endereco, id } = data;

  const { lastID } = await db.run(sql, [nome, tutor, telefone, endereco, id]);

  return lastID;
}

async function readAll() {
  const sql = `
    SELECT
      *
    FROM
      pets
    WHERE
      id <> 0
  `;

  const db = await conn();

  const pets = await db.all(sql);

  return pets;
}

async function search(nome) {
  nome=`%${nome}%`
  const sql = `
    SELECT
      *
    FROM
      pets
    WHERE
      nome LIKE ? AND id <> 0
  `;

  const db = await conn();

  const pets = await db.all(sql, nome);

  return pets;
}

async function readById(id) {
  const sql = `
    SELECT
      *
    FROM
      pets
    WHERE
      id=? AND id <> 0
  `;

  const db = await conn();

  const pets = await db.get(sql, id);

  return pets;
}

async function update(id, data) {
  for (const campo in data){
    if(data[campo].length<1){
      return -1;
    }
  }
  const sql = `
    UPDATE
      pets
    SET
      nome = ?, tutor = ?, telefone = ?, endereco = ?
    WHERE
      id = ? AND id <> 0
  `;

  const db = await conn();

  const { nome, tutor, telefone, endereco } = data;

  const { changes } = await db.run(sql, [nome, tutor, telefone, endereco, id]);

  return changes;
}

async function destroy(id) {
  const sql = `
    DELETE FROM
      pets
    WHERE
      id = ? AND id <> 0
  `;

  const db = await conn();

  const { lastID } = await db.run(sql, [id]);

  return lastID;
}

async function readByName(nome) {
  nome=`%${nome}%`
  const sql = `
    SELECT
      nome, tutor, id
    FROM
      pets
    WHERE
      nome LIKE ? AND id <> 0
    LIMIT 5
  `;

  const db = await conn();

  const pets = await db.all(sql, nome);

  return pets;
}

async function readFirst5() {
  const sql = `
    SELECT
      nome, tutor, id
    FROM
      pets
    WHERE
      id <> 0
    LIMIT 5
  `;

  const db = await conn();

  const pets = await db.all(sql);

  return pets;
}

module.exports = { create, readAll, readById, update, destroy, readByName, readFirst5, search };
