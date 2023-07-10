const express = require("express");
const router = express.Router();
const responsavelController = require("../controllers/responsavelController");
const { celebrate, Joi, Segments, isCelebrateError } = require("celebrate");
const userAuth = require("../middleware/userAuth");

router.get("/", userAuth.userAuth, responsavelController.index);
router.post("/pesquisa", userAuth.userAuth, responsavelController.pesquisa);
router.post(
  "/",
  userAuth.userAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string().required(),
      funcao: Joi.string().required(),
      telefone: Joi.string().required(),
      email: Joi.string().email().required(),
      senha: Joi.string().required(),
      senhaConf: Joi.ref("senha"),
    }),
  }),
  responsavelController.createResponsavel
);
router.get("/delete", userAuth.userAuth, responsavelController.deletePage);
router.post("/delete", userAuth.userAuth, responsavelController.deleteResponsavel);
router.get("/edit", userAuth.userAuth, responsavelController.editResponsavelForm);
router.post(
  "/edit",
  userAuth.userAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.string().required(),
      nome: Joi.string().required(),
      funcao: Joi.string().required(),
      telefone: Joi.string().required(),
      email: Joi.string().email().required(),
      senhaAntiga: Joi.string().required(),
      senhaNova: Joi.string().required(),
      senhaConf: Joi.ref("senhaNova"),
    }),
  }),
  responsavelController.editResponsavel
);
router.get("/login", responsavelController.loginPage);
router.post("/login", responsavelController.login);
router.get("/logout", userAuth.userAuth, responsavelController.logout);
router.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    res.locals.erro = err.details.get("body").details[0];
    const { id } = req.body;
    if (id) {
      res.locals.id = id;
    }
    next();
  }
}, responsavelController.erroResponsavelForm);

module.exports = router;
