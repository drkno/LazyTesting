var express = require('express'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
    model = require('./model.js'),
    path = require('path'),
    mime = require('mime');

var	server = express();
server.use(bodyParser.json());

// Add headers and serve static files
server.use(function(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.header("X-Powered-By", "SWS - Software With Style");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    if (req.url.indexOf("/api") !== 0) {
        if (req.url === "/") {
            req.url = "/index.html";
        }
        
        var file = path.join(__dirname, 'html', req.url);
        var type = mime.lookup(file);
        fs.readFile(file, function (err, data) {
            if (err) {
                res.contentType("application/json");
                res.status(404).send('{"complete":false, "message":"file not found"}');
                return;
            }
            res.contentType(type);
            res.send(data);
        });
    } else {
        next();
    }
});

// update model
server.post('/api/current', function(req, res) {
	try {
		var json = req.body;
		model.setItemData(json.feature, json.scenario, json.tester, json.passing, json.comment);
		res.contentType("application/json");
		res.send('{"complete":true}');
	}
	catch(e) {
		res.contentType("application/json");
		res.status(500).send('{"complete":false, "message":' + JSON.stringify(e) + ',"data":' + JSON.stringify(req.body) + '}');
	}
});

// get model
server.get('/api/current', function(req, res) {
	res.contentType("application/json");
	res.send(model.currentState());
});

// automatically assign members
server.get('/api/autoassign', function(req, res) {
	model.autoAssign();
	res.contentType("application/json");
	res.send('{"complete":true}');
});

// get the pdf
server.get('/api/pdf', function(req, res) {
  fs.readFile('doc.pdf', function (err,data){
     res.contentType("application/pdf");
     res.send(data);
  });
});

// reset the api
server.get('/api/reset', function (req, res) {
	model.refreshData(function() {
		res.contentType("application/json");
		res.send('{"complete":true}');
	});
});

// startup
model.refreshData(function() {
	server.listen(80);
});
