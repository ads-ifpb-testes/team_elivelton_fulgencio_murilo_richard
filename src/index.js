const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectSqlite = require("connect-sqlite3")(session);
const dotenv = require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Pet Shop",
      version: "1.0.0",
      description: "API rest para um Pet Shop em express. O usuário pode criar responsáveis, pets e atendimentos que relacionam os dois.",
    },
    servers: [
      { url: "http://localhost:8080/", description: "Servidor local" },
      { url: "https://pet-shop-vna2.onrender.com/", description: "Servidor de produção" },
    ],
    tags: [{ name: "Responsável" }, { name: "Pet" }, { name: "Atendimento" }],
  },
  apis: ["./src/routes/atendimentoAPI.js", "./src/routes/petAPI.js", "./src/routes/responsavelAPI.js"],
};
const swaggerSpec = swaggerJsdoc(options);

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,
    name: "userSession",
    cookie: { maxAge: 86400000 }, //1 dia
    store: new connectSqlite(),
  })
);

const routes = require("./routes");
app.use(express.static("public"));
app.use("/images", express.static("src/images"));
app.use("/api/v1/images", express.static("src/images"));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(routes);
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).send("Página não existe");
});

app.listen(8080, () => {
  console.log("App executando na porta 8080");
});
