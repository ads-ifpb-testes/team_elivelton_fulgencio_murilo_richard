const Responsavel = require("../models/Responsaveis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
  const responsaveis = await Responsavel.readAll();
  res.render("responsavel.ejs", { responsaveis, erro: null });
};

const pesquisa = async (req, res) => {
  const { nome } = req.body;
  const responsaveis = await Responsavel.search(nome);
  res.render("responsavel.ejs", { responsaveis, erro: null });
};

const createResponsavel = async (req, res) => {
  try {
    const hashSenha = await bcrypt.hash(req.body.senha, Number(process.env.SALT));
    const { nome, funcao, telefone, email } = req.body;
    const responsavel = { nome, funcao, telefone, email, senha: hashSenha };

    await Responsavel.create(responsavel);
    res.redirect("/responsavel");
  } catch (e) {
    console.log(e);
  }
};

const loginPage = (req, res) => {
  res.render("login.ejs");
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  const responsavel = await Responsavel.readByEmail(email);
  if (responsavel) {
    try {
      if (await bcrypt.compare(senha, responsavel.senha)) {
        const token = jwt.sign({ user: responsavel.id }, process.env.SECRET, { expiresIn: 86400 });
        req.session.user = responsavel;
        res.set("auth", `Bearer ${token}`);
        res.cookie("token", `Bearer ${token}`);
        res.redirect("/");
        return;
      } else {
        console.log("Senha errada");
        res.redirect("/responsavel/login");
        return;
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.redirect("/responsavel/login");
    return;
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.clearCookie("token");
  res.redirect("/");
};

const deletePage = async (req, res) => {
  const { id } = req.query;
  const responsavel = await Responsavel.readById(id);
  res.render("deletePage.ejs", { backUrl: "/responsavel", url: "/responsavel/delete", id, obj: responsavel.nome });
};

const deleteResponsavel = async (req, res) => {
  const responsaveis = await Responsavel.readAll();
  if (responsaveis.length > 1) {
    const { id } = req.body;
    const responsavel = await Responsavel.readById(id);
    if (responsavel && responsavel.nome != req.session.user.nome && req.session.user.id == "1") {
      await Responsavel.destroy(id);
    }
  }
  res.redirect("/responsavel");
};

const editResponsavelForm = async (req, res) => {
  const { id } = req.query;
  const responsavel = await Responsavel.readById(id);
  if (responsavel) {
    if (responsavel.nome === req.session.user.nome) {
      res.render("responsavelEdit.ejs", { responsavel, erro: null });
      return;
    } else {
      res.redirect("/responsavel");
    }
  } else {
    res.redirect("/responsavel");
  }
};

const editResponsavel = async (req, res) => {
  const { id } = req.body;
  const { nome, funcao, telefone, email, senhaAntiga, senhaNova } = req.body;
  const responsavel = await Responsavel.readById(id);
  if (responsavel) {
    try {
      if (await bcrypt.compare(senhaAntiga, responsavel.senha)) {
        try {
          const hashSenha = await bcrypt.hash(senhaNova, Number(process.env.SALT));
          const responsavelNovo = { nome, funcao, telefone, email, senha: hashSenha };
          await Responsavel.update(id, responsavelNovo);
          req.session.user = await Responsavel.readById(id);
          res.redirect("/responsavel");
          return;
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log("Senha errada");
        res.redirect("/responsavel");
        return;
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.redirect("/responsavel");
    return;
  }
};

const erroResponsavelForm = async (req, res) => {
  if (req.originalUrl.includes("edit")) {
    const responsavel = await Responsavel.readById(res.locals.id);
    res.render("responsavelEdit.ejs", { responsavel });
    return;
  } else {
    const responsaveis = await Responsavel.readAll();
    res.render("responsavel.ejs", { responsaveis });
    return;
  }
};

module.exports = {
  index,
  login,
  loginPage,
  createResponsavel,
  deleteResponsavel,
  editResponsavelForm,
  editResponsavel,
  erroResponsavelForm,
  logout,
  deletePage,
  pesquisa,
};
