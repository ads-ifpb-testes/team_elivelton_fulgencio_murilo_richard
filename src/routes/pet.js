const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const { celebrate, Joi, Segments, isCelebrateError } = require("celebrate");
const userAuth = require("../middleware/userAuth");

const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../images"))
  },

  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({storage: storage});


router.get("/", userAuth.userAuth, petController.index);
router.post("/pesquisa", userAuth.userAuth, petController.pesquisa);
router.post(
  "/",
  upload.single("image"),
  userAuth.userAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string().required(),
      tutor: Joi.string().required(),
      telefone: Joi.string().required(),
      endereco: Joi.string().required(),
    }),
  }),
  petController.createPet
);
router.get("/delete", userAuth.userAuth, petController.deletePage)
router.post("/delete", userAuth.userAuth, petController.deletePet);
router.get("/edit", userAuth.userAuth, upload.single("image"), petController.editPetForm);
router.post(
  "/edit",
  userAuth.userAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.string().required(),
      nome: Joi.string().required(),
      tutor: Joi.string().required(),
      telefone: Joi.string().required(),
      endereco: Joi.string().required(),
    }),
  }),
  petController.editPet
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
}, petController.erroPetForm);

module.exports = router;
