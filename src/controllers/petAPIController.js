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
  const id = req.params.id
  const pet = await Pet.readById(parseInt(id));
  if (pet) {
    res.json({ pet });
    return;
  } else {
    res.status(404).json({ error: `Pet não encontrado!` });
  }
};

const createPet = async (req, res) => {
  const { nome, tutor, telefone, endereco } = req.body;
  const pet = { nome, tutor, telefone, endereco, imagem: req.file.filename };

  const petID = await Pet.create(pet);

  const newPet = await Pet.readById(petID);

  res.status(201).json({ newPet });
};

const deletePet = async (req, res) => {
  const deleteId = req.params.deleteId
  const pet = await Pet.readById(deleteId);

  if (pet) {
    await Pet.destroy(deleteId);
    res.json({ deleteId });
    return;
  } else {
    res.status(404).json({ error: `Pet não encontrado!` });
  }
};

const editPet = async (req, res) => {
  const { id } = req.body;
  if (await Pet.readById(id)) {
    const { nome, tutor, telefone, endereco } = req.body;
    const pet = { nome, tutor, telefone, endereco, imagem: req.file.filename };

    await Pet.update(id, pet);
    const petEdited = await Pet.readById(id);

    res.json({ petEdited });
  } else {
    res.status(404).json({ error: `Pet não encontrado!` });
  }
};

const getEndereco = async (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) return res.sendStatus(500);
  try {
    const request = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.MAP_KEY}`
    ).then(async r => await r.json());

    const data = request;

    const address = data.results[0].formatted_address;
    
    if (address) return res.json({ address });
    else return res.status(400).json({ error: 'Endereço não encontrado' });
  } catch (error) {
    return res.sendStatus(500);
  }
};

module.exports = {
  readAll,
  readById,
  createPet,
  deletePet,
  editPet,
  pesquisa,
  getEndereco
};
