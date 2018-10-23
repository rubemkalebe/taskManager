var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path')
var fs = require('fs');

var app = express();
app.set('port', 8080);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.route('/login')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/login.html')
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;
        console.log(username + ":" + password);
        res.redirect('/home');
    });

app.route('/register')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/register.html')
    })
    .post((req, res) => {
        var nome = req.body.nome,
        	usuario = req.body.usuario,
        	senha = req.body.senha,
            corfirmSenha = req.body.corfirmSenha;
        console.log(nome + " " + usuario + " " + senha + " " + corfirmSenha);
        res.redirect('/login');
    });

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
});

app.route('/tasks')
    .get((req, res) => {
		fs.createReadStream('tasks.json', 'UTF-8').pipe(res);
    })
    .post((req, res) => {
        var contentToSave = req.body['tarefas'];
        console.log(contentToSave);
        fs.writeFile('tasks.json', contentToSave, function(err) {
			if(err) throw err;
			res.json(contentToSave);
		});
    });

app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));