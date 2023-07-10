const Atendimento = require("../models/Atendimentos");
const Responsavel = require("../models/Responsaveis");
const AtendimentoTipo = require("../models/AtendimentoTipo");
const Pet = require("../models/Pet");

const readAll = async (req, res) => {
  const atendimentos = await Atendimento.readAllAPI();
  res.json({ atendimentos });
};

const readById = async (req, res) => {
  const { id } = req.body;
  const atendimento = await Atendimento.readById(id);
  if (atendimento) {
    res.json({ atendimento });
  } else {
    res.status(404).json({ error: `Atendimento não encontrado!` });
  }
};

const pesquisa = async (req, res) => {
  let { tipoAtendimento, descricao } = req.body;
  if (!tipoAtendimento) {
    tipoAtendimento = "";
  }
  if (!descricao) {
    descricao = "";
  }
  const pesquisa = { tipoAtendimento, descricao };
  const atendimentos = await Atendimento.search(pesquisa);
  res.json({ atendimentos });
};

const createAtendimento = async (req, res) => {
  const { tipoAtendimento, responsavel, pet, descricao, date } = req.body;
  if ((await Responsavel.readById(responsavel)) && (await Pet.readById(pet)) && (await AtendimentoTipo.readByType(tipoAtendimento))) {
    const atendimento = {
      tipoAtendimento,
      responsavel,
      pet,
      descricao,
      date,
      completo: 0,
    };
    const atendimentoID = await Atendimento.create(atendimento);
    const newAtendimento = await Atendimento.readById(atendimentoID);
    res.json({ newAtendimento });
    return;
  } else {
    if (!(await Responsavel.readById(responsavel))) {
      res.status(404).json({ error: "Não existe um responsável com o ID informado" });
      return;
    } else if (!(await Pet.readById(pet))) {
      res.status(404).json({ error: "Não existe um pet com o ID informado" });
      return;
    } else {
      res.status(404).json({ error: "Não existe atendimento do tipo informado" });
      return;
    }
  }
};

const deleteAtendimento = async (req, res) => {
  const { id } = req.body;
  const atendimento = await Atendimento.readById(id);
  if (atendimento) {
    await Atendimento.destroy(id);
    res.json({ id });
  } else {
    res.status(404).json({ error: `Atendimento não encontrado!` });
  }
};

const editAtendimento = async (req, res) => {
  const { id } = req.body;
  if (await Atendimento.readById(id)) {
    const { tipoAtendimento, responsavel, pet, descricao, date } = req.body;
    const atendimento = { tipoAtendimento, responsavel, pet, descricao, date };
    await Atendimento.update(id, atendimento);
    const atendimentoEdited = await Atendimento.readById(id);
    res.json({ atendimentoEdited });
  } else {
    res.status(404).json({ error: `Atendimento não encontrado!` });
  }
};

const completeAtendimento = async (req, res) => {
  const { id } = req.body;
  if (await Atendimento.readById(id)) {
    await Atendimento.complete(id);
    const atendimentoComplete = await Atendimento.readById(id);
    res.json(atendimentoComplete);
  } else {
    res.status(404).json({ error: `Atendimento não encontrado!` });
  }
};

module.exports = {
  readAll,
  readById,
  createAtendimento,
  deleteAtendimento,
  editAtendimento,
  completeAtendimento,
  pesquisa,
};
