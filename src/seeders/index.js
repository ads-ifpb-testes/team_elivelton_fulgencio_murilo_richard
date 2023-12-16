const Responsaveis = require('../models/Responsaveis');
const Pet = require('../models/Pet');
const AtendimentoTipo = require('../models/AtendimentoTipo');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const data = require('./data.json');

async function up() {
  for (let atendimentoTipo of data.atendimentoTipos) {
    await Promise.all([
      AtendimentoTipo.create(atendimentoTipo),
      AtendimentoTipo.create(atendimentoTipo, true),
    ]);
  }
  for (let petDeletado of data.petsDeletados) {
    await Promise.all([Pet.create(petDeletado), Pet.create(petDeletado, true)]);
  }
  for (let responsavelDeletado of data.responsaveisDeletados) {
    await Promise.all([
      Responsaveis.create(responsavelDeletado),
      Responsaveis.create(responsavelDeletado, true),
    ]);
  }

  try {
    const hashSenha = await bcrypt.hash(process.env.SENHA, Number(process.env.SALT));

    const admin = {
      nome: process.env.NOME,
      funcao: process.env.FUNCAO,
      telefone: process.env.TELEFONE,
      email: process.env.EMAIL,
      senha: hashSenha,
      imagem: "img"
    };
    await Promise.all([Responsaveis.create(admin), Responsaveis.create(admin, true)]);
  } catch (e) {
    console.log(e);
  }
}

module.exports = { up };
