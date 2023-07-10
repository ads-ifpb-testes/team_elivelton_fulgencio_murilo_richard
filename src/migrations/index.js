const { conn } = require("../db");

async function up() {
  const db = await conn();

  await db.run(`
    CREATE TABLE IF NOT EXISTS atendimentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipoAtendimento TEXT,
      responsavel INTEGER DEFAULT 2,
      descricao TEXT,
      pet INTEGER DEFAULT 1,
      date DATETIME,
      complete INTEGER,
      FOREIGN KEY (responsavel) REFERENCES responsaveis (id) ON DELETE SET DEFAULT,
      FOREIGN KEY (pet) REFERENCES pets (id) ON DELETE SET DEFAULT
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS responsaveis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      funcao TEXT, 
      telefone TEXT,
      senha TEXT,
      email TEXT UNIQUE
    )
  `); // funcao faz referencia ao cargo do responsável

  await db.run(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      tutor TEXT,
      telefone TEXT,
      endereco TEXT
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS atendimentoTipo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT UNIQUE
    )
  `);
}

async function down() {
  const db = await conn();

  await db.run("DROP TABLE atendimentos");

  await db.run("DROP TABLE responsaveis");

  await db.run("DROP TABLE pets");
}

module.exports = { up, down };
