/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  schemas:
 *    Atendimento:
 *      type: object
 *      required:
 *        - id
 *        - tipoAtendimento
 *        - descricao
 *        - date
 *        - responsavel
 *        - pet
 *      properties:
 *        id:
 *          type: string
 *          description: O id do atendimento gerado automaticamente
 *        tipoAtendimento:
 *          type: string
 *          description: O tipo do atendimento
 *        descricao:
 *          type: string
 *          description: A descrição do atendimento
 *        date:
 *          type: string
 *          description: A data do atendimento
 *        responsavel:
 *          type: string
 *          description: O responsavel pelo atendimento
 *        pet:
 *          type: string
 *          description: O pet que vai ser atendido
 *        complete:
 *          type: integer
 *          description: Diz se o atendimento está pendente (0) ou concluído (1)
 *      example:
 *        id: 5
 *        tipoAtendimento: Veterinário
 *        descricao: Consulta veterinária
 *        date: 2023-06-15T13:00
 *        responsavel: João
 *        pet: Bidu
 *        complete: 1
 *    newAtendimento:
 *      type: object
 *      required:
 *        - tipoAtendimento
 *        - responsavel
 *        - pet
 *        - descricao
 *        - date
 *      properties:
 *        tipoAtendimento:
 *          type: string
 *          description: O tipo do atendimento
 *        responsavel:
 *          type: integer
 *          description: O id do responsavel
 *        pet:
 *          type: integer
 *          description: O id do pet
 *        descricao:
 *          type: string
 *          description: A descrição do atendimento
 *        date:
 *          type: string
 *          description: A data do atendimento
 *      example:
 *        tipoAtendimento: Veterinário
 *        responsavel: 2
 *        pet: 1
 *        descricao: Consulta veterinária
 *        date: 2023-06-15T13:00
 *    editAtendimento:
 *      type: object
 *      required:
 *        - id
 *        - tipoAtendimento
 *        - descricao
 *        - date
 *        - responsavel
 *        - pet
 *      properties:
 *        id:
 *          type: string
 *          description: O id do atendimento gerado automaticamente
 *        tipoAtendimento:
 *          type: string
 *          description: O tipo do atendimento
 *        descricao:
 *          type: string
 *          description: A descrição do atendimento
 *        date:
 *          type: string
 *          description: A data do atendimento
 *        responsavel:
 *          type: integer
 *          description: O id do responsavel
 *        pet:
 *          type: integer
 *          description: O id do pet
 *      example:
 *        id: 5
 *        tipoAtendimento: Veterinário
 *        descricao: Consulta veterinária
 *        date: 2023-06-15T13:00
 *        responsavel: 2
 *        pet: 1
 */

const express = require("express");
const router = express.Router();
const atendimentoAPIController = require("../controllers/atendimentoAPIController");
const userAuth = require("../middleware/userAuth");
const { celebrate, Joi, Segments } = require("celebrate");
/**
 * @swagger
 * /api/v1/atendimento:
 *  get:
 *    tags: [Atendimento]
 *    summary: Retorna uma lista com todos os atendimentos
 *    responses:
 *      200:
 *        description: A lista com todos os atendimentos
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                atendimentos:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Atendimento"
 */
router.get("/", atendimentoAPIController.readAll);
/**
 * @swagger
 * /api/v1/atendimento:
 *  post:
 *    tags: [Atendimento]
 *    summary: Retorna o atendimento com aquele id
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
 *        description: O atendimento com o id informado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                atendimento:
 *                  $ref: "#/components/schemas/Atendimento"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      404:
 *        description: Atendimento não encontrado!
 */
router.get(
  "/:id",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.required(),
    }),
  }),
  atendimentoAPIController.readById
);
/**
 * @swagger
 * /api/v1/atendimento/pesquisa:
 *  post:
 *    tags: [Atendimento]
 *    summary: Retorna uma lista com os atendimentos pesquisados
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: false
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tipoAtendimento:
 *                type: string
 *                description: O tipo do atendimento
 *              descricao:
 *                type: string
 *                description: A descrição do atendimento
 *          example:
 *            tipoAtendimento: Veterinário
 *            descricao: Consulta veterinária
 *    responses:
 *      200:
 *        description: Os atendimentos pesquisados
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                atendimentos:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Atendimento"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 */
router.post(
  "/pesquisa",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      tipoAtendimento: Joi.string().optional().empty(""),
      descricao: Joi.string().optional().empty(""),
    }),
  }),
  atendimentoAPIController.pesquisa
);
/**
 * @swagger
 * /api/v1/atendimento/create:
 *  post:
 *    tags: [Atendimento]
 *    summary: Cria um novo atendimento
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/newAtendimento"
 *    responses:
 *      200:
 *        description: O atendimento criado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                newAtendimento:
 *                  $ref: "#/components/schemas/Atendimento"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 */
router.post(
  "/create",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      tipoAtendimento: Joi.string().required(),
      responsavel: Joi.required(),
      pet: Joi.required(),
      descricao: Joi.string().required(),
      date: Joi.date().required(),
    }),
  }),
  atendimentoAPIController.createAtendimento
);
/**
 * @swagger
 * /api/v1/atendimento/delete:
 *  delete:
 *    tags: [Atendimento]
 *    summary: Retorna o id do atendimento deletado
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
 *        description: O id do atendimento deletado
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
 *        description: Atendimento não encontrado!
 */
router.delete(
  "/delete/:deleteId",
  userAuth.apiAuth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      deleteId: Joi.required(),
    }),
  }),
  atendimentoAPIController.deleteAtendimento
);
/**
 * @swagger
 * /api/v1/atendimento/edit:
 *  patch:
 *    tags: [Atendimento]
 *    summary: Edita um atendimento
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/editAtendimento"
 *    responses:
 *      200:
 *        description: O atendimento editado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                atendimentoEdited:
 *                  $ref: "#/components/schemas/Atendimento"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      404:
 *        description: Atendimento não encontrado!
 */
router.patch(
  "/edit",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.required(),
      tipoAtendimento: Joi.string().required(),
      responsavel: Joi.required(),
      pet: Joi.required(),
      descricao: Joi.string().required(),
      date: Joi.string().required(),
    }),
  }),
  userAuth.apiAuth,
  atendimentoAPIController.editAtendimento
);
/**
 * @swagger
 * /api/v1/atendimento/complete:
 *  post:
 *    tags: [Atendimento]
 *    summary: Retorna o atendimento com o atributo "complete" mudado de 0 para 1 ou de 1 para 0
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
 *        description: O atendimento com o id informado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Atendimento"
 *      401:
 *        description: Cabeçalho de token vazio ou token inválido
 *      404:
 *        description: Atendimento não encontrado!
 */
router.post(
  "/complete",
  userAuth.apiAuth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.required(),
    }),
  }),
  atendimentoAPIController.completeAtendimento
);

module.exports = router;
