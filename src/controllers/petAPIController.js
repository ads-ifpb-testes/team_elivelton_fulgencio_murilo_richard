const Pet = require("../models/Pet");

const readAll = async (req, res) => {
  const pets = await Pet.readAll();
  res.json({ pets });
};

const pesquisa = async (req, res) => {
  let { nome } = req.body;
  if (!nome) {
    nome = "";
  }
  const pets = await Pet.search(nome);
  res.json({ pets });
};

const readById = async (req, res) => {
  const { id } = req.body;
  const pet = await Pet.readById(id);

  if (pet) {
    res.json({ pet });
    return;
  } else {
    res.status(404).json({ error: `Pet não encontrado!` });
  }
};

const createPet = async (req, res) => {
  const { nome, tutor, telefone, endereco } = req.body;
  const pet = { nome, tutor, telefone, endereco };

  const petID = await Pet.create(pet);

  const newPet = await Pet.readById(petID);

  res.status(201).json({ newPet });
};

const deletePet = async (req, res) => {
  const { id } = req.body;
  const pet = await Pet.readById(id);

  if (pet) {
    await Pet.destroy(id);
    res.json({ id });
    return;
  } else {
    res.status(404).json({ error: `Pet não encontrado!` });
  }
};

const editPet = async (req, res) => {
  const { id } = req.body;
  if (await Pet.readById(id)) {
    const { nome, tutor, telefone, endereco } = req.body;
    const pet = { nome, tutor, telefone, endereco };

    await Pet.update(id, pet);
    const petEdited = await Pet.readById(id);

    res.json({ petEdited });
  } else {
    res.status(404).json({ error: `Pet não encontrado!` });
  }
};

module.exports = {
  readAll,
  readById,
  createPet,
  deletePet,
  editPet,
  pesquisa,
};
