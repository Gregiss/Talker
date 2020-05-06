const express = require("express");
const path = require("path");
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const crypto = require("crypto");

app.use(express.static(path.join(__dirname, 'public')));
const porta = process.env.PORT || 8000;

app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var estouLogado = false;

const mysql      = require('mysql');
const conn = mysql.createConnection({
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
    res.render('home/index.html');
})

app.use('/', (req, res) => {
    res.render('home/index.html');
})

function passwordCry(password){
    var crypto = require('crypto')
    , shasum = crypto.createHash('sha1');
    shasum.update("foo");
    return shasum.digest(password);
}

function existUser(user){
    conn.query('SELECT * FROM users WHERE user = ?', [user], function(err, results) {
        if (results.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}

function register(user, password){
    if(!existUser(user)){
        const newUser = {user: user, password: passwordCry(password),
        token: `${generate_token(20)}-${generate_token(30)}`, admin: 0 }
        conn.query(
            'INSERT INTO users SET ?', newUser, (err, res) => {
            if (err) throw err

            console.log(`Add sucess user added with ID: ${res.insertId}`)
        })
    }
}

io.sockets.on('connection', function(socket) {
conn.connect(function(err){
    if(err) return;
    console.log(`Entrou alguem com ID ${socket.id}`);
    socket.on('conectar', data => {
        socket.emit('conectado', generate_token(40))
    })
    socket.on('register', data => {
        if(data.user && data.password)
            register(data.user, data.password);
    })
})
})

server.listen(porta);