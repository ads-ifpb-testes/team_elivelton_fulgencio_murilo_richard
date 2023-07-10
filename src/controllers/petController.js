const Pet = require("../models/Pet");

const index = async (req, res) => {
  const pets = await Pet.readAll();
  res.render("pet.ejs", { pets, erro: null });
};

const pesquisa = async (req, res) => {
  const { nome } = req.body
  const pets = await Pet.search(nome);
  res.render("pet.ejs", { pets, erro: null });
};

const createPet = async (req, res) => {
  const { nome, tutor, telefone, endereco } = req.body;
  const pet = { nome, tutor, telefone, endereco };

  await Pet.create(pet);
  res.redirect("/pet");
};

const deletePage = async (req, res) => {
  const { id } = req.query;
  const pet = await Pet.readById(id);
  res.render("deletePage.ejs", { backUrl: "/pet", url: "/pet/delete", id, obj: pet.nome });
};

const deletePet = async (req, res) => {
  const { id } = req.body;
  const pet = await Pet.readById(id);
  if (pet && req.session.user.id == "1") {
    await Pet.destroy(id);
  }
  res.redirect("/pet");
};

const editPetForm = async (req, res) => {
  const { id } = req.query;
  const pet = await Pet.readById(id);
  res.render("petEdit.ejs", { pet, erro: null });
};

const editPet = async (req, res) => {
  const { id } = req.body;
  const { nome, tutor, telefone, endereco } = req.body;
  const pet = { nome, tutor, telefone, endereco };

  await Pet.update(id, pet);
  res.redirect("/pet");
};

const erroPetForm = async (req, res) => {
  if (req.originalUrl.includes("edit")) {
    const pet = await Pet.readById(res.locals.id);
    res.render("petEdit.ejs", { pet });
    return;
  } else {
    const pets = await Pet.readAll();
    res.render("pet.ejs", { pets });
    return;
  }
};

module.exports = {
  index,
  createPet,
  deletePet,
  editPetForm,
  editPet,
  erroPetForm,
  deletePage,
  pesquisa,
};
