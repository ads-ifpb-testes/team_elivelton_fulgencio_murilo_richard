const Responsavel = require("../models/Responsaveis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const readAll = async (req, res) => {
  const responsaveis = await Responsavel.readAll();
  res.json({ responsaveis });
};

const pesquisa = async (req, res) => {
  let { nome } = req.body;
  if (!nome) {
    nome = "";
  }
  const responsaveis = await Responsavel.search(nome);
  res.json({ responsaveis });
};

const readById = async (req, res) => {
  const { id } = req.body;
  const responsavel = await Responsavel.readById(id);
  if (responsavel) {
    res.json({ responsavel });
  } else {
    res.status(404).json({ error: `Responsável não encontrado!` });
  }
};

const createResponsavel = async (req, res) => {
  if (await Responsavel.readByEmail(req.body.email)) {
    res.status(409).json({ error: "Email já cadastrado" });
    return;
  }
  try {
    const hashSenha = await bcrypt.hash(req.body.senha, Number(process.env.SALT));
    const { nome, funcao, telefone, email } = req.body;
    const responsavel = { nome, funcao, telefone, email, senha: hashSenha, imagem: req.file.filename };

    const responsavelID = await Responsavel.create(responsavel);
    const newResponsavel = await Responsavel.readById(responsavelID);
    res.json({ newResponsavel });
  } catch (error) {
    res.json({ error });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  const responsavel = await Responsavel.readByEmail(email);
  if (responsavel) {
    try {
      if (await bcrypt.compare(senha, responsavel.senha)) {
        const token = jwt.sign({ user: responsavel.id }, process.env.SECRET, {
        });
        res.set("auth", `Bearer ${token}`);
        res.json({ token: `Bearer ${token}`, nome: responsavel.nome, img: responsavel.imagem, email: responsavel.email, funcao: responsavel.funcao, id: responsavel.id, telefone: responsavel.telefone });
        return;
      } else {
        res.status(401).json({ error: "Responsável não cadastrado ou senha errada!" });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(401).json({ error: "Responsável não cadastrado ou senha errada!" });
    return;
  }
};

const deleteResponsavel = async (req, res) => {
  const responsaveis = await Responsavel.readAll();
  if (responsaveis.length > 1) {
    const deleteId = req.params.deleteId
    const { id } = req.body;
    const responsavel = await Responsavel.readById(deleteId);
    if (responsavel) {
      if (responsavel.id != "1" && parseInt(id) == 1) {
        await Responsavel.destroy(deleteId);
        res.json({ deleteId });
        return;
      } else if (responsavel.id == "1") {
        res.status(400).json({ error: "Responsável é o admin, impossível deletar" });
        return;
      } else if (parseInt(id) != 1) {
        res.status(400).json({ error: "Somente o admin pode deletar" });
      } else {
        res.status(404).json({ error: `Responsável não encontrado!` });
        return;
      }
    } else {
      res.status(404).json({ error: `Responsável não encontrado!` });
      return;
    }
  }
  res.json({
    error: "Tabela de responsavéis contém apenas 1 responsável, impossível deletar",
  });
};

const editResponsavel = async (req, res) => {
  const { id } = req.body;
  const { nome, funcao, telefone, email, senhaAntiga, senhaNova } = req.body;

  const responsavelOld = await Responsavel.readById(parseInt(id));
  if (responsavelOld) {
    try {
      if (await bcrypt.compare(senhaAntiga, responsavelOld.senha)) {
        try {
          const hashSenha = await bcrypt.hash(senhaNova, Number(process.env.SALT));
          const responsavelNovo = { nome, funcao, telefone, email, senha: hashSenha, imagem: req.file.filename };
          await Responsavel.update(parseInt(id), responsavelNovo);
          
          const responsavelEdited = await Responsavel.readById(parseInt(id));
          res.json({ responsavelEdited });
          return;
        } catch (e) {
          console.log(e);
        }
      } else {
        res.status(400).json({ error: "Senha antiga errada!"});
        return;
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(404).json({ error: `Responsável não encontrado!` });
  }
};

const editResponsavelSimple = async (req, res) => {
  const editedId = req.params.editedId
  const { funcao } = req.body;

  const responsavelOld = await Responsavel.readById(parseInt(editedId));
  if (responsavelOld) {
    try {
      const responsavelNovo = { 
        nome: responsavelOld.nome, 
        funcao, 
        telefone: responsavelOld.telefone, 
        email: responsavelOld.email, 
        senha: responsavelOld.senha, 
        imagem: responsavelOld.imagem };
      await Responsavel.update(parseInt(editedId), responsavelNovo);
      
      const responsavelEdited = await Responsavel.readById(parseInt(editedId));
      res.json({ responsavelEdited });
      return;
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(404).json({ error: `Responsável não encontrado!` });
  }
};

module.exports = {
  readAll,
  readById,
  login,
  createResponsavel,
  deleteResponsavel,
  editResponsavel,
  editResponsavelSimple,
  pesquisa,
};
