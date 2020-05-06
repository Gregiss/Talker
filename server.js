const express = require("express");
const path = require("path");
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, 'public')));
const porta = process.env.PORT || 8000;

app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var estouLogado = false;

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '',
  database : 'talker'
});

function generate_token(length){
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

app.use('home', (req, res) => {
    if(!estouLogado)
        res.render('home/index.html');
})

app.use('/', (req, res) => {
    if(!estouLogado)
        res.render('home/index.html');
})

io.sockets.on('connection', function(socket) {
connection.connect(function(err){
    if(err) return;
    console.log(`Entrou alguem com ID ${socket.id}`);
    socket.on('conectar', data => {
        socket.emit('conectado', generate_token(40))
    })
})
})

server.listen(porta);