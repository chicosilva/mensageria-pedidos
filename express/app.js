var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {produce, do_consume} = require('./rabittmq-server');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

options={
  cors:false,
  origins:["*"],
 }

const io = new Server(server, options);
//io.origins('*:*');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get("/lista", function (req, res, next) {
  
  do_consume();
  
  res.render("index.ejs", { title: "tete" });

});

app.post("/pedido", function (req, res, next) {

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
  
  io.emit('sent message', 'newMessage');

  produce(dados);
  res.json({ sucesso: true });
  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


io.on('connection', (socket) => {
  console.log("server")
  //socket.emit('teste', 'teste');

  socket.on('sent message', (message) => {
    io.emit('new message', 'teste');
  });


});

module.exports = app;
