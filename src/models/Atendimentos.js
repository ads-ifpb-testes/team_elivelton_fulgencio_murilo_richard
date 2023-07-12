const { conn, connTest } = require('../db');

async function create(data, test) {
  const sql = `
  INSERT INTO 
    atendimentos (tipoAtendimento, responsavel, pet, descricao, date, complete) 
  VALUES 
    (?, ?, ?, ?, ?, ?)
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  let { tipoAtendimento, responsavel, pet, descricao, date, completo } = data;
  //console.log(new Date(date).toISOString().slice(0,16));
  date = new Date(date).toISOString().slice(0, 16);
  const { lastID } = await db.run(sql, [
    tipoAtendimento,
    responsavel,
    pet,
    descricao,
    date,
    completo,
  ]);

  return lastID;
}

async function readAll(test) {
  const sql = `
    SELECT
      a.id, a.tipoAtendimento, a.descricao, a.date, r.nome as responsavel, p.nome as pet, a.complete as complete
    FROM
      atendimentos a 
    INNER JOIN 
      responsaveis r
    ON
      a.responsavel = r.id
    INNER JOIN
      pets p
    ON
      a.pet = p.id
    ORDER BY
      complete ASC
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const atendimentos = await db.all(sql);

  for (let atendimento of atendimentos) {
    let [data, hora] = atendimento.date.split('T');
    let [ano, mes, dia] = data.split('-');
    let dataFormatada = `${dia}/${mes}/${ano} às ${hora}`;
    atendimento.date = dataFormatada;
  }

  return atendimentos;
}

async function readAllAPI(test) {
  const sql = `
    SELECT
      a.id, a.tipoAtendimento, a.descricao, a.date, r.nome as responsavel, p.nome as pet, a.complete as complete
    FROM
      atendimentos a 
    INNER JOIN 
      responsaveis r
    ON
      a.responsavel = r.id
    INNER JOIN
      pets p
    ON
      a.pet = p.id
    ORDER BY
      complete ASC
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const atendimentos = await db.all(sql);

  return atendimentos;
}

async function search(pesquisa, test) {
  pesquisa.descricao = `%${pesquisa.descricao}%`;
  pesquisa.tipoAtendimento = `%${pesquisa.tipoAtendimento}%`;
  const sql = `
    SELECT
      a.id, a.tipoAtendimento, a.descricao, a.date, r.nome as responsavel, p.nome as pet, a.complete as complete
    FROM
      atendimentos a 
    INNER JOIN 
      responsaveis r
    ON
      a.responsavel = r.id
    INNER JOIN
      pets p
    ON
      a.pet = p.id
    WHERE
      a.tipoAtendimento like ? and a.descricao like ?
    ORDER BY
      complete ASC
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const atendimentos = await db.all(sql, pesquisa.tipoAtendimento, pesquisa.descricao);

  for (let atendimento of atendimentos) {
    let [data, hora] = atendimento.date.split('T');
    let [ano, mes, dia] = data.split('-');
    let dataFormatada = `${dia}/${mes}/${ano} às ${hora}`;
    atendimento.date = dataFormatada;
  }

  return atendimentos;
}

async function readById(id, test) {
  const sql = `
    SELECT
      a.id, a.tipoAtendimento, a.descricao, a.date, r.nome as responsavel, p.nome as pet, a.complete as complete
    FROM
      atendimentos a 
    INNER JOIN 
      responsaveis r
    ON
      a.responsavel = r.id
    INNER JOIN
      pets p
    ON
      a.pet = p.id
    WHERE
      a.id=?
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const atendimentos = await db.get(sql, id);

  return atendimentos;
}

async function update(id, data, test) {
  const sql = `
    UPDATE
      atendimentos
    SET
      tipoAtendimento = ?, responsavel = ?, pet = ?, descricao = ?, date = ?
    WHERE
      id = ?
  `;

  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const { tipoAtendimento, responsavel, pet, descricao, date } = data;

  const { changes } = await db.run(sql, [tipoAtendimento, responsavel, pet, descricao, date, id]);

  return changes;
}

async function complete(id, test) {
  const atendimento = await readById(id);
  if (atendimento.complete == '0') {
    atendimento.complete = '1';
  } else {
    atendimento.complete = '0';
  }
  const sql = `
    UPDATE
      atendimentos
    SET
      complete = ?
    WHERE
      id = ?
  `;
  let db;
  if (test) {
    db = await connTest();
  } else {
    db = await conn();
  }

  const { changes } = await db.run(sql, [atendimento.complete, id]);

  return changes;
}

async function destroy(id, test) {
  const sql = `
    DELETE FROM
      atendimentos
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

module.exports = { create, readAll, readAllAPI, readById, update, destroy, complete, search };
