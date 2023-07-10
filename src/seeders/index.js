const Responsaveis = require("../models/Responsaveis");
const Pet = require("../models/Pet");
const AtendimentoTipo = require("../models/AtendimentoTipo");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const data = require("./data.json");

async function up() {
  for (let atendimentoTipo of data.atendimentoTipos) {
    await AtendimentoTipo.create(atendimentoTipo);
  }
  for (let petDeletado of data.petsDeletados) {
    await Pet.create(petDeletado);
  }
  for (let responsavelDeletado of data.responsaveisDeletados) {
    await Responsaveis.create(responsavelDeletado);
  }

  try {
    const hashSenha = await bcrypt.hash(process.env.SENHA, Number(process.env.SALT));

    const admin = {
      nome: process.env.NOME,
      funcao: process.env.FUNCAO,
      telefone: process.env.TELEFONE,
      email: process.env.EMAIL,
      senha: hashSenha,
    };

    await Responsaveis.create(admin);
  } catch (e) {
    console.log(e);
  }
}

module.exports = { up };
