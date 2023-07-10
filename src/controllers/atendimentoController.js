const Atendimento = require("../models/Atendimentos");
const Responsavel = require("../models/Responsaveis");
const AtendimentoTipo = require("../models/AtendimentoTipo")
const Pet = require("../models/Pet");

const index = async (req, res) => {
  const responsaveis = await Responsavel.readFirst5();
  const pets = await Pet.readFirst5();
  const tipos = await AtendimentoTipo.readAll();
  res.render("atendimento.ejs", { tipos, responsaveis, pets, erro: null, responsavelPesquisado: null, petPesquisado: null });
};

const createAtendimento = async (req, res) => {
  const { tipoAtendimento, responsavel, pet, descricao, date } = req.body;
  const atendimento = { tipoAtendimento, responsavel, pet, descricao, date, completo: 0 };

  await Atendimento.create(atendimento);
  res.redirect("/atendimento");
};

const deletePage = async (req, res) => {
  const { id } = req.query;
  const atendimento = await Atendimento.readById(id);
  res.render("deletePage.ejs", { backUrl: "/", url: "/atendimento/delete", id, obj: `atendimento de ${atendimento.pet}` });
};

const deleteAtendimento = async (req, res) => {
  const { id } = req.body;
  const atendimento = await Atendimento.readById(id);
  if (atendimento && req.session.user.id == "1") {
    await Atendimento.destroy(id);
  }
  res.redirect("/home");
};

const editAtendimentoForm = async (req, res) => {
  const responsaveis = await Responsavel.readFirst5();
  const pets = await Pet.readFirst5();
  const { id } = req.query;
  const atendimento = await Atendimento.readById(id);
  const tipos = await AtendimentoTipo.readAll();
  res.render("atendimentoEdit.ejs", { tipos, responsaveis, pets, atendimento, erro: null, responsavelPesquisado: null, petPesquisado: null });
};

const editAtendimento = async (req, res) => {
  const { id } = req.body;
  const { tipoAtendimento, responsavel, pet, descricao, date } = req.body;
  const atendimento = { tipoAtendimento, responsavel, pet, descricao, date };
  await Atendimento.update(id, atendimento);
  res.redirect("/home");
};

const completeAtendimento = async (req, res) => {
  const { id } = req.body;
  await Atendimento.complete(id);
  res.redirect("/home");
};

const erroAtendimentoForm = async (req, res) => {
  if (req.originalUrl.includes("edit")) {
    const atendimento = await Atendimento.readById(res.locals.id);
    const { responsavelInput, petInput, pesquisar } = req.body;
    let responsaveis = await Responsavel.readFirst5();
    let pets = await Pet.readFirst5();
    if (responsavelInput && pesquisar) {
      responsaveis = await Responsavel.readByName(responsavelInput);
    }
    if (petInput && pesquisar) {
      pets = await Pet.readByName(petInput);
    }
    if (responsavelInput || petInput) {
      res.render("atendimentoEdit.ejs", {
        atendimento,
        responsaveis,
        pets,
        responsavelPesquisado: responsavelInput,
        petPesquisado: petInput,
      });
      return;
    } else {
      res.render("atendimentoEdit.ejs", { atendimento, responsaveis, pets, responsavelPesquisado: null, petPesquisado: null });
      return;
    }
  } else {
    const { responsavelInput, petInput, pesquisar } = req.body;
    let responsaveis = await Responsavel.readFirst5();
    let pets = await Pet.readFirst5();
    const tipos = await AtendimentoTipo.readAll();
    if (responsavelInput && pesquisar) {
      responsaveis = await Responsavel.readByName(responsavelInput);
    }
    if (petInput && pesquisar) {
      pets = await Pet.readByName(petInput);
    }
    if (responsavelInput || petInput) {
      res.render("atendimento.ejs", { tipos, responsaveis, pets, responsavelPesquisado: responsavelInput, petPesquisado: petInput });
      return;
    } else {
      res.render("atendimento.ejs", { tipos, responsaveis, pets, responsavelPesquisado: null, petPesquisado: null });
      return;
    }
  }
};

module.exports = {
  index,
  createAtendimento,
  deleteAtendimento,
  editAtendimentoForm,
  editAtendimento,
  erroAtendimentoForm,
  completeAtendimento,
  deletePage,
};
