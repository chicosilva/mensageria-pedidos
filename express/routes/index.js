var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'tete' });
});

router.post('/pedido', function(req, res, next) {
  res.json({ sucesso: true });
});

module.exports = router;
