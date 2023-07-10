const express = require("express");
const router = express.Router();
const Atendimento = require("../models/Atendimentos");
const AtendimentoTipos = require("../models/AtendimentoTipo");
const { isCelebrateError } = require("celebrate");

const atendimentoRouter = require("./atendimento");
const responsavelRouter = require("./responsavel");
const petRouter = require("./pet");
const petAPIRouter = require("./petAPI");
const responsavelAPIRouter = require("./responsavelAPI");
const atendimentoAPIRouter = require("./atendimentoAPI");

router.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});
router.use("/atendimento", atendimentoRouter);
router.use("/responsavel", responsavelRouter);
router.use("/pet", petRouter);
router.use("/api/v1/pet", petAPIRouter);
router.use("/api/v1/responsavel", responsavelAPIRouter);
router.use("/api/v1/atendimento", atendimentoAPIRouter);

router.get("/home", async (req, res) => {
  const atendimentos = await Atendimento.readAll();
  const tipos = await AtendimentoTipos.readAll();
  res.render("index", { tipos, atendimentos });
});
router.post("/home", async (req, res) => {
  const { tipoAtendimento, descricao } = req.body;
  pesquisa = { tipoAtendimento, descricao };
  const atendimentos = await Atendimento.search(pesquisa);
  const tipos = await AtendimentoTipos.readAll();
  res.render("index", { tipos, atendimentos });
});

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.use((err, req, res, next) => {
  if (isCelebrateError(err) && req.originalUrl.includes("api")) {
    const erro = err.details.get("body").details[0];
    res.json({error: erro});
    return;
  }
});

module.exports = router;
