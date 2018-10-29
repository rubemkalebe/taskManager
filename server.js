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
            password = req.body.password
            auth = false;
    	fs.readFile('users.json', function(err, data) {
    		if(err) throw err;

    		var usersJSON = JSON.parse(data.toString());
    		for(var i = 0; i < usersJSON.length; i++) {
    			if(username == usersJSON[i].username && password == usersJSON[i].password) {
    				auth = true;
    				break;
    			}
    		}

	        if(auth) {
	        	res.redirect('/home');
	        } else {
	        	res.redirect('/login');
	        }
    	});
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
        
        fs.readFile('users.json', function(err, data) {
    		if(err) throw err;
    		var usersJSON = JSON.parse(data.toString()),
    			user = {
    				"fullname" : nome,
				    "username" : usuario,
				    "password" : senha
				}
			usersJSON.push(user);
    		fs.writeFile('users.json', JSON.stringify(usersJSON), function(err) {
				if(err) throw err;
				res.redirect('/login');
			});
    	});
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

app.get('/statistics', (req, res) => {
    res.sendFile(__dirname + '/public/statistics.html');
});

app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));