const { conn, connTest } = require('../db');

async function create(data, test) {
  for (const campo in data) {
    if (data[campo].length < 1) {
      return -1;
    }
  }
  const sql = `
  INSERT INTO 
    pets (nome, tutor, telefone, endereco, id, imagem) 
  VALUES 
    (?, ?, ?, ?, ?, ?)
  `;
  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const { nome, tutor, telefone, endereco, id, imagem } = data;

  const { lastID } = await db.run(sql, [nome, tutor, telefone, endereco, id, imagem]);

  return lastID;
}

async function readAll(test) {
  const sql = `
    SELECT
      *
    FROM
      pets
    WHERE
      id <> 0
  `;

    let db;
    if (test) {
      db = await connTest();
    } else {
      db = await conn();
    }

  const pets = await db.all(sql);

  return pets;
}

async function search(nome, test) {
  nome = `%${nome}%`;
  const sql = `
    SELECT
      *
    FROM
      pets
    WHERE
      nome LIKE ? AND id <> 0
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const pets = await db.all(sql, nome);

  return pets;
}

async function readById(id, test) {
  const sql = `
    SELECT
      *
    FROM
      pets
    WHERE
      id=? AND id <> 0
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const pets = await db.get(sql, id);

  return pets;
}

async function update(id, data, test) {
  for (const campo in data) {
    if (data[campo].length < 1) {
      return -1;
    }
  }
  const sql = `
    UPDATE
      pets
    SET
      nome = ?, tutor = ?, telefone = ?, endereco = ?, imagem = ?
    WHERE
      id = ? AND id <> 0
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const { nome, tutor, telefone, endereco, imagem } = data;

  const { changes } = await db.run(sql, [nome, tutor, telefone, endereco, imagem, id]);

  return changes;
}

async function destroy(id, test) {
  const sql = `
    DELETE FROM
      pets
    WHERE
      id = ? AND id <> 0
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

async function readByName(nome, test) {
  nome = `%${nome}%`;
  const sql = `
    SELECT
      *
    FROM
      pets
    WHERE
      nome LIKE ? AND id <> 0
    LIMIT 5
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const pets = await db.all(sql, nome);

  return pets;
}

async function readFirst5(test) {
  const sql = `
    SELECT
      *
    FROM
      pets
    WHERE
      id <> 0
    LIMIT 5
  `;

    let db;
    if (test) {
      db = await connTest();
    } else {
      db = await conn();
    }

  const pets = await db.all(sql);

  return pets;
}

module.exports = { create, readAll, readById, update, destroy, readByName, readFirst5, search };
