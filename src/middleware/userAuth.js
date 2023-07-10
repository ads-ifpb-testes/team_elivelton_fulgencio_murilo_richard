const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    try {
      jwt.verify(token.split(" ")[1], process.env.SECRET);
      next();
      return;
    } catch (e) {
      req.session.user = null;
      res.redirect("/responsavel/login");
    }
  } else {
    req.session.user = null;
    res.redirect("/responsavel/login");
  }
};

const apiAuth = async (req, res, next) => {
  const token = req.get("authorization");
  if (token) {
    try {
      jwt.verify(token.split(" ")[1], process.env.SECRET);
      next();
      return;
    } catch (error) {
      res.status(401).json({error: `Cabeçalho de token vazio ou token inválido!`});
    }
  } else {
    res.status(401).json({error: `Cabeçalho de token vazio ou token inválido`});
  }
};

module.exports = { userAuth, apiAuth };
