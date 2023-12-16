/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *      description: Coloque um token JWT, por exemplo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE2ODgwNjk3NTUsImV4cCI6MTY4ODE1NjE1NX0.RiwIdoa9CbbcoRDewtQEE8q7trH1dpk1pQ5MHkIomis"
 *  schemas:
 *    Responsavel:
 *      type: object
 *      required:
 *        - id
 *        - nome
 *        - funcao
 *        - telefone
 *        - email
 *      properties:
 *        id:
 *          type: string
 *          description: O id do responsavel gerado automaticamente
 *        nome:
 *          type: string
 *          description: O nome do responsavel
 *        funcao:
 *          type: string
 *          description: A função do responsavel
 *        telefone:
 *          type: string
 *          description: O telefone do responsavel
 *        email:
 *          type: string
 *          description: O email do responsavel
 *      example:
 *        id: 3
 *        nome: João
 *        funcao: Veterinário
 *        telefone: "89224002"
 *        email: "joao@gmail.com"
 *    newResponsavel:
 *      type: object
 *      required:
 *        - nome
 *        - funcao
 *        - telefone
 *        - senha
 *        - email
 *      properties:
 *        nome:
 *          type: string
 *          description: O nome do responsavel
 *        funcao:
 *          type: string
 *          description: A função do responsavel
 *        telefone:
 *          type: string
 *          description: O telefone do responsavel
 *        senha:
 *          type: string
 *          description: A senha do responsavel
 *        email:
 *          type: string
 *          description: O email do responsavel
 *      example:
 *        nome: João
 *        funcao: Veterinário
 *        telefone: "89224002"
 *        senha: senha123
 *        email: "joao@gmail.com"
 *    loginResponsavel:
 *      type: object
 *      required:
 *        - email
 *        - senha
 *      properties:
 *        email:
 *          type: string
 *          description: O email do responsavel
 *        senha:
 *          type: string
 *          description: A senha do responsavel
 *      example:
 *        email: "joao@gmail.com"
 *        senha: senha123
 *    editResponsavel:
 *      type: object
 *      required:
 *        - id
 *        - nome
 *        - funcao
 *        - telefone
 *        - email
 *        - senhaAntiga
 *        - senhaNova
 *      properties:
 *        id:
 *          type: string
 *          description: O id do responsavel gerado automaticamente
 *        nome:
 *          type: string
 *          description: O nome do responsavel
 *        funcao:
 *          type: string
 *          description: A função do responsavel
 *        telefone:
 *          type: string
 *          description: O telefone do responsavel
 *        email:
 *          type: string
 *          description: O email do responsavel
 *        senhaAntiga:
 *          type: string
 *          description: A senha antiga responsavel
 *        senhaNova:
 *          type: string
 *          description: A senha nova responsavel
 *      example:
 *        id: 3
 *        nome: João
 *        funcao: Veterinário
 *        telefone: "89224002"
 *        email: "joao@gmail.com"
 *        senhaAntiga: senha123
 *        senhaNova: senha456
 */

const express = require("express");
const router = express.Router();
const responsavelAPIController = require("../controllers/responsavelAPIController");
const userAuth = require("../middleware/userAuth");
const { celebrate, Joi, Segments } = require("celebrate");
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

/**
 * @swagger
 * /api/v1/responsavel:
 *  get:
 *    tags: [Responsável]
 *    summary: Retorna uma lista com todos os responsáveis
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: A lista com todos os responsáveis
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                responsaveis:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Responsavel"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 */
router.get("/", userAuth.apiAuth, responsavelAPIController.readAll);
router.get("/verify", userAuth.apiAuth, (req, res) => {
  res.status(200).json({})
})
/**
 * @swagger
 * /api/v1/responsavel:
 *  post:
 *    tags: [Responsável]
 *    summary: Retorna o responsável com aquele id
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *    responses:
 *      200:
 *        description: O responsavel com o id informado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                responsavel:
 *                  $ref: "#/components/schemas/Responsavel"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      404:
 *        description: Responsável não encontrado!
 */
router.post(
  "/",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.required(),
    }),
  }),
  responsavelAPIController.readById
);
/**
 * @swagger
 * /api/v1/responsavel/pesquisa:
 *  post:
 *    tags: [Responsável]
 *    summary: Retorna uma lista com os responsáveis pesquisados
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: false
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nome:
 *                type: string
 *    responses:
 *      200:
 *        description: Os responsáveis pesquisados
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                responsáveis:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Responsavel"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 */
router.post("/pesquisa", userAuth.apiAuth, responsavelAPIController.pesquisa);
/**
 * @swagger
 * /api/v1/responsavel/login:
 *  post:
 *    tags: [Responsável]
 *    summary: Retorna um token JWT para autenticação
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/loginResponsavel"
 *    responses:
 *      200:
 *        description: O token JWT
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *            example:
 *              token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE2ODgwNjk3NTUsImV4cCI6MTY4ODE1NjE1NX0.RiwIdoa9CbbcoRDewtQEE8q7trH1dpk1pQ5MHkIomis
 *      401:
 *        description: Responsável não cadastrado ou senha errada!
 */
router.post(
  "/login",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
      senha: Joi.string().required(),
    }),
  }),
  responsavelAPIController.login
);
/**
 * @swagger
 * /api/v1/responsavel/create:
 *  post:
 *    tags: [Responsável]
 *    summary: Cria um novo responsável
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/newResponsavel"
 *    responses:
 *      200:
 *        description: O responsável criado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                newResponsavel:
 *                  $ref: "#/components/schemas/Responsavel"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      409:
 *        description: Email já cadastrado
 */
router.post(
  "/create",
  upload.single("image"),
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string().required(),
      funcao: Joi.string().required(),
      telefone: Joi.string().required(),
      email: Joi.string().email().required(),
      senha: Joi.string().required(),
    }),
  }),
  responsavelAPIController.createResponsavel
);
/**
 * @swagger
 * /api/v1/responsavel/delete:
 *  delete:
 *    tags: [Responsável]
 *    summary: Retorna o id do responsável deletado
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *    responses:
 *      200:
 *        description: O id do responsável deletado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *      400:
 *        description: Responsável é o admin, impossível deletar
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      404:
 *        description: Responsável não encontrado!
 */
router.delete(
  "/delete/:deleteId",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.required(),
    }),
  }),
  responsavelAPIController.deleteResponsavel
);
/**
 * @swagger
 * /api/v1/responsavel/edit:
 *  patch:
 *    tags: [Responsável]
 *    summary: Edita um responsável
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/editResponsavel"
 *    responses:
 *      200:
 *        description: O responsável editado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                responsavelEdited:
 *                  $ref: "#/components/schemas/Responsavel"
 *      400:
 *        description: Senha antiga errada!
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      404:
 *        description: Responsável não encontrado!
 */
router.patch(
  "/edit",
  upload.single("image"),
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.required(),
      nome: Joi.string().required(),
      funcao: Joi.string().required(),
      telefone: Joi.string().required(),
      email: Joi.string().email().required(),
      senhaAntiga: Joi.string().required(),
      senhaNova: Joi.string().required(),
    }),
  }),
  responsavelAPIController.editResponsavel
);

router.patch(
  "/editSimple/:editedId",
  userAuth.apiAuth,
  responsavelAPIController.editResponsavelSimple
);

module.exports = router;
