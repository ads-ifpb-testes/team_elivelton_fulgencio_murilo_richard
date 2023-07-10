/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  schemas:
 *    Pet:
 *      type: object
 *      required:
 *        - id
 *        - nome
 *        - tutor
 *        - telefone
 *        - endereco
 *      properties:
 *        id:
 *          type: string
 *          description: O id do pet gerado automaticamente
 *        nome:
 *          type: string
 *          description: O nome do pet
 *        tutor:
 *          type: string
 *          description: O tutor do pet
 *        telefone:
 *          type: string
 *          description: O telefone do tutor
 *        endereco:
 *          type: string
 *          description: O endereco do tutor
 *      example:
 *        id: 5
 *        nome: Bidu
 *        tutor: João
 *        telefone: "40028922"
 *        endereco: Rua José Antônio da Silva, 300
 *    newPet:
 *      type: object
 *      required:
 *        - nome
 *        - tutor
 *        - telefone
 *        - endereco
 *      properties:
 *        nome:
 *          type: string
 *          description: O nome do pet
 *        tutor:
 *          type: string
 *          description: O tutor do pet
 *        telefone:
 *          type: string
 *          description: O telefone do tutor
 *        endereco:
 *          type: string
 *          description: O endereco do tutor
 *      example:
 *        nome: Bidu
 *        tutor: João
 *        telefone: "40028922"
 *        endereco: Rua José Antônio da Silva, 300
 */
const express = require("express");
const router = express.Router();
const petAPIController = require("../controllers/petAPIController");
const userAuth = require("../middleware/userAuth");
const { celebrate, Joi, Segments } = require("celebrate");

/**
 * @swagger
 * /api/v1/pet:
 *  get:
 *    tags: [Pet]
 *    summary: Retorna uma lista com todos os pets
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: A lista com todos os pets
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                pets:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Pet"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 */
router.get("/", userAuth.apiAuth, petAPIController.readAll);
/**
 * @swagger
 * /api/v1/pet:
 *  post:
 *    tags: [Pet]
 *    summary: Retorna o pet com aquele id
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
 *        description: O pet com o id informado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                pet:
 *                  $ref: "#/components/schemas/Pet"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      404:
 *        description: Pet não encontrado!
 */
router.post(
  "/",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.required(),
    }),
  }),
  petAPIController.readById
);
/**
 * @swagger
 * /api/v1/pet/create:
 *  post:
 *    tags: [Pet]
 *    summary: Cria um novo pet
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/newPet"
 *    responses:
 *      200:
 *        description: O pet criado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                newPet:
 *                  $ref: "#/components/schemas/Pet"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 */
router.post(
  "/create",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string().required(),
      tutor: Joi.string().required(),
      telefone: Joi.required(),
      endereco: Joi.string().required(),
    }),
  }),
  petAPIController.createPet
);
/**
 * @swagger
 * /api/v1/pet/pesquisa:
 *  post:
 *    tags: [Pet]
 *    summary: Retorna uma lista com os pets pesquisados
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
 *          example:
 *            nome: Bidu
 *    responses:
 *      200:
 *        description: Os pets pesquisados
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                pets:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Pet"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 */
router.post(
  "/pesquisa",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string().optional().empty(""),
    }),
  }),
  petAPIController.pesquisa
);

/**
 * @swagger
 * /api/v1/pet/delete:
 *  delete:
 *    tags: [Pet]
 *    summary: Retorna o id do pet deletado
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
 *        description: O id do pet deletado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      404:
 *        description: Pet não encontrado!
 */
router.delete(
  "/delete",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.required(),
    }),
  }),
  petAPIController.deletePet
);
/**
 * @swagger
 * /api/v1/pet/edit:
 *  patch:
 *    tags: [Pet]
 *    summary: Edita um pet
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Pet"
 *    responses:
 *      200:
 *        description: O pet editado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                petEdited:
 *                  $ref: "#/components/schemas/Pet"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      404:
 *        description: Pet não encontrado!
 */
router.patch(
  "/edit",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.required(),
      nome: Joi.string().required(),
      tutor: Joi.string().required(),
      telefone: Joi.string().required(),
      endereco: Joi.string().required(),
    }),
  }),
  petAPIController.editPet
);

module.exports = router;
