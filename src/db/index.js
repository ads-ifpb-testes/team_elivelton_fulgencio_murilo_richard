const path = require('path');
const Database = require('sqlite-async');

const dbFile = path.resolve(__dirname, 'database.sqlite');

async function conn() {
  const db = await Database.open(dbFile);
  await db.get("PRAGMA foreign_keys = ON");
  return db;
}

module.exports = { conn, dbFile };