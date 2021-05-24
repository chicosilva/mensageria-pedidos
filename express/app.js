const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const {produce, do_consume} = require('./rabittmq-server');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post("/pedido",  (req, res) => {

  const pedido = {
    id: req.body.id,
    valor: req.body.valor,
    cliente: req.body.cliente,
  };

  const dados = {
    exch: "pedidos",
    q: "novo-pedido",
    rkey: "novo-pedido",
    msg: pedido
  }
  
  produce(dados);
  res.json({ sucesso: true });
  
});

io.on('connection', (socket) => {
  
  /*
  socket.on('atualiza_lista', (msg) => {
    do_consume(io);
  });
  */

});

function intervalFunc() {
  
  do_consume(io);
}

setInterval(intervalFunc, 1500);

server.listen(3000, () => {
  console.log('listening on *:3000');
});