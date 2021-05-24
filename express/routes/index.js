var express = require("express");
var router = express.Router();
const {produce, do_consume} = require('../rabittmq-server');


router.get("/", function (req, res, next) {
  
  do_consume();

  res.render("index", { title: "tete" });
});

router.post("/pedido-old", function (req, res, next) {

  const dados = {
    exch: "pedidos",
    q: "novo-pedido",
    rkey: "novo-pedido",
    msg: {
      id: req.body.id,
      valor: req.body.valor,
      cliente: req.body.cliente,
    }
  }
  produce.produce(dados);

  res.json({ sucesso: true });
  
});

module.exports = router;
