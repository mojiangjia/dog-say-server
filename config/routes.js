'use strict'

var Router = require('koa-router');
var User = require('../app/controller/user');
var App = require('../app/controller/app');
var Creation = require('../app/controller/creation');
var Comment = require('../app/controller/comment');

module.exports = function () {
	var router = new Router({
		prefix: '/api'
	});

	router.post('/u/signup', App.hasBody, User.signup);
	router.post('/u/auth', App.hasBody, User.auth);
	router.post('/u/update', App.hasBody, App.hasToken, User.update);

	router.post('/signature', App.hasBody, App.hasToken, App.signature);
	
	router.get('/creations', App.hasToken, Creation.list);
	router.post('/creations', App.hasBody, App.hasToken, Creation.save);
	router.post('/creations/video', App.hasBody, App.hasToken, Creation.video);
	router.post('/creations/audio', App.hasBody, App.hasToken, Creation.audio);

	router.get('/comments', App.hasToken, Comment.list);
	router.post('/comments', App.hasBody, App.hasToken, Comment.save);

	router.post('/like', App.hasBody, App.hasToken, Creation.like);

	return router;
}