'use strict'

// init mongo model
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var db = 'mongodb://localhost/dogsay';

mongoose.Promise = require('bluebird');
mongoose.connect(db);

// alternative
// require('./app/model/user');
// require('./app/model/video');

var modelPath = path.join(__dirname, '/app/model');
var walk = function (modelPath) {
	fs
		.readdirSync(modelPath)
		.forEach(function (file) {
			var filePath = path.join(modelPath, '/' + file);
			var state = fs.statSync(filePath);

			if (state.isFile()) {
				if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath);
        }
			}
			else if (state.isDirectory()) {
				walk(filePath);
			}
		})
}

walk(modelPath);

// koa sever
var koa = require('koa');
var logger = require('koa-logger');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var app = new koa();

app.keys = ['dogsay'];
app.use(logger());
app.use(session(app));
app.use(bodyParser());

var router = require('./config/routes')();

app
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(8080);
console.log('Listening on port 8080');