var express = require('express');
var router = express.Router();
const amqplib = require('amqplib');

async function produce(){
  var amqp_url = 'amqp://admin:admin@rabbitmq:5672';
  console.log("Publishing");
  var conn = await amqplib.connect(amqp_url, "heartbeat=60");
  var ch = await conn.createChannel();

  var exch = 'pedidos';
  var q = 'novo-pedido';
  var rkey = 'novo-pedido';
  var msg = {
    id: 11,
    cliente: "José"
  };
  
  await ch.assertExchange(exch, 'direct', {durable: true}).catch(console.error);
  await ch.assertQueue(q, {durable: true});
  await ch.bindQueue(q, exch, rkey);

  await ch.publish(exch, rkey, Buffer.from(JSON.stringify(msg)));

  setTimeout( function()  {
      ch.close();
      conn.close();},  500 );
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'tete' });
});

router.post('/pedido', function(req, res, next) {
  
  produce();
  res.json({ sucesso: true });

});

module.exports = router;
