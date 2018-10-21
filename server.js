var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
	if(req.method === "POST") {
		var contentToSave;
		req.on("data", function(data) {
			contentToSave = data.toString().split('=')[1];
			console.log(contentToSave);
		});

		req.on("end", function() {
			res.writeHead(200, {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			});
			//res.end('Post received');
			fs.writeFile('tasks.json', contentToSave, function(err) {
				if(err) throw err;
				res.end(contentToSave);
			});
		});
	} else if (req.method === "GET") {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		});
		fs.createReadStream('tasks.json', 'UTF-8').pipe(res);
	}
}).listen(8080);