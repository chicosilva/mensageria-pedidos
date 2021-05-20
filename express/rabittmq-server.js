const amqplib = require("amqplib");

const amqp_url = "amqp://admin:admin@rabbitmq:5672";

async function produce(dados) {
    
    const {exch, q, rkey, msg} = {...dados}
    
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


module.exports = { produce }