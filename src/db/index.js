const path = require('path');
const Database = require('sqlite-async');

const dbFile = path.resolve(__dirname, 'database.sqlite');
const dbFileTest = path.resolve(__dirname, 'databaseTest.sqlite');

async function conn() {
  const db = await Database.open(dbFile);
  await db.get('PRAGMA foreign_keys = ON');
  return db;
}

async function connTest(){
  const db = await Database.open(dbFileTest);
  await db.get('PRAGMA foreign_keys = ON');
  return db;
}

module.exports = { conn, connTest, dbFile, dbFileTest };
