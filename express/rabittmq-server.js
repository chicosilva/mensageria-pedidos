const amqplib = require("amqplib");

const amqp_url = "amqp://admin:admin@rabbitmq:5672";

async function produce(dados) {
  const { exch, q, rkey, msg } = { ...dados };

  var conn = await amqplib.connect(amqp_url, "heartbeat=60");
  var ch = await conn.createChannel();

  await ch
    .assertExchange(exch, "direct", { durable: true })
    .catch(console.error);

  await ch.assertQueue(q, { durable: true });
  await ch.bindQueue(q, exch, rkey);

  await ch.publish(exch, rkey, Buffer.from(JSON.stringify(msg)));

  setTimeout(function () {
    ch.close();
    conn.close();
  }, 500);
}

async function do_consume(io) {
    
  var conn = await amqplib.connect(amqp_url, "heartbeat=60");
    var ch = await conn.createChannel()
    var q = 'novo-pedido';
    await conn.createChannel();
    await ch.assertQueue(q, {durable: true});
    await ch.consume(q, function (msg) {
        
        //console.log(msg.content.toString());
        ch.ack(msg);
        ch.cancel('myconsumer');
        io.emit("atualiza_lista", msg.content.toString());
        
        return msg;


    }, {consumerTag: 'myconsumer'});
    setTimeout( function()  {
        ch.close();
        conn.close();},  500 );
}


module.exports = { produce, do_consume };
