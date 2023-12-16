const { conn, connTest } = require('../db');

async function create(data, test) {
  for (const campo in data) {
    if (data[campo].length < 1) {
      return -1;
    }
  }
  const sql = `
  INSERT INTO 
    responsaveis (nome, funcao, telefone, email, senha, imagem, id) 
  VALUES 
    (?, ?, ?, ?, ?, ?, ?)
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const { nome, funcao, telefone, email, senha, id, imagem } = data;

  const { lastID } = await db.run(sql, [nome, funcao, telefone, email, senha, imagem, id]);

  return lastID;
}

async function readAll(test) {
  const sql = `
    SELECT
      *
    FROM
      responsaveis
    WHERE
      id <> 0
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const responsaveis = await db.all(sql);

  return responsaveis;
}

async function readById(id, test) {
  const sql = `
    SELECT
    *
    FROM
      responsaveis
    WHERE
      id=? AND id <> 0
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const responsaveis = await db.get(sql, id);

  return responsaveis;
}

async function search(nome, test) {
  nome = `%${nome}%`;
  const sql = `
    SELECT
      *
    FROM
      responsaveis
    WHERE
      nome LIKE ? AND id <> 0
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const responsaveis = await db.all(sql, nome);

  return responsaveis;
}

async function readByEmail(email, test) {
  const sql = `
    SELECT
      *
    FROM
      responsaveis
    WHERE
      email=? AND id <> 0
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const responsaveis = await db.get(sql, email);

  return responsaveis;
}

async function update(id, data, test) {
  for (const campo in data) {
    if (data[campo].length < 1) {
      return -1;
    }
  }
  const sql = `
    UPDATE
      responsaveis
    SET
      nome = ?, funcao = ?, telefone = ?, email = ?, senha = ?, imagem = ?
    WHERE
      id = ? AND id <> 0
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const { nome, funcao, telefone, email, senha, imagem } = data;

  const { changes } = await db.run(sql, [nome, funcao, telefone, email, senha, imagem, id]);

  return changes;
}

async function destroy(id, test) {
  const sql = `
    DELETE FROM
      responsaveis
    WHERE
      id = ? AND id <> 0
  `;

  const sqlUpdate = `
    UPDATE
      atendimentos
    SET
      responsavel = 0
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
  await db.run(sqlUpdate, [id]);

  return lastID;
}

async function readByName(nome, test) {
  nome = `%${nome}%`;
  const sql = `
    SELECT
      *
    FROM
      responsaveis
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

  const responsaveis = await db.all(sql, nome);

  return responsaveis;
}

async function readFirst5(test) {
  const sql = `
    SELECT
      *
    FROM
      responsaveis
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
