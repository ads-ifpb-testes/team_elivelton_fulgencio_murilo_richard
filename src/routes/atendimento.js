const express = require("express");
const router = express.Router();
const atendimentoController = require("../controllers/atendimentoController");
const { celebrate, Joi, Segments, isCelebrateError } = require("celebrate");
const userAuth = require("../middleware/userAuth");

router.get("/", userAuth.userAuth, atendimentoController.index);
router.post(
  "/",
  userAuth.userAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      tipoAtendimento: Joi.string().required(),
      responsavel: Joi.string().required(),
      pet: Joi.string().required(),
      descricao: Joi.string().required(),
      date: Joi.string().required(),
      responsavelInput: Joi.string().optional().empty(''),
      petInput: Joi.string().optional().empty(''),
      pesquisar: Joi.string().optional().empty(''),
    }),
  }),
  atendimentoController.createAtendimento
);
router.get("/delete", userAuth.userAuth, atendimentoController.deletePage);
router.post("/delete", userAuth.userAuth, atendimentoController.deleteAtendimento);
router.post("/complete", userAuth.userAuth, atendimentoController.completeAtendimento);
router.get("/edit", userAuth.userAuth, atendimentoController.editAtendimentoForm);
router.post(
  "/edit",
  userAuth.userAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      tipoAtendimento: Joi.string().required(),
      responsavel: Joi.string().required(),
      descricao: Joi.string().required(),
      pet: Joi.string().required(),
      date: Joi.required(),
      id: Joi.string().required(),
      responsavelInput: Joi.string().optional().empty(''),
      petInput: Joi.string().optional().empty(''),
      pesquisar: Joi.string().optional().empty(''),
    }),
  }),
  atendimentoController.editAtendimento
);

router.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    res.locals.erro = err.details.get("body").details[0];
    const { id } = req.body;
    if (id) {
      res.locals.id = id;
    }
    next();
  }
}, atendimentoController.erroAtendimentoForm);

module.exports = router;
