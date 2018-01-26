'use strict'

var mongoose = require('mongoose');
var sha1 = require('sha1');
var User = mongoose.model('User');
var config = require('../../config/config');

exports.signature = async (ctx, next) => {
	var body = ctx.request.body;
	var type = body.type;
	var timestamp = body.timestamp;
	var folder;
	var tags;

	if (type === 'avatar') {
		folder = 'avatar';
		tags = 'app,avatar';
	}
	else if (type === 'video') {
		folder = 'video';
		tags = 'app,video';
	}
	else if (type === 'audio') {
		folder = 'audio';
		tags = 'app,audio';
	}

	var signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + config.cloudinary.api_secret;
	signature = sha1(signature);

	ctx.body = {
		success: true,
		data: signature
	};
};


exports.hasBody = async (ctx, next) => {
	var body = ctx.request.body || {};

	if (!body || Object.keys(body).length === 0) {
		ctx.body = {
			success: false,
			err: 'something missing'
		};

		return next;
	}

	await next();
}


exports.hasToken = async (ctx, next) => {
	if (!ctx.query.accessToken && !ctx.request.body.accessToken) {
		ctx.body = {
			success: false,
			err: 'no accessToken'
		};
		return next;
	}

	var accessToken = ctx.query.accessToken || ctx.request.body.accessToken;

	var user = await User.findOne({
		accessToken: accessToken
	}).exec();

	if (!user) {
		ctx.body = {
			success: false,
			err: 'Not logged in'
		};
		return next;
	}

	ctx.session = ctx.session || {};
	ctx.session.user = user;

	await next();

}
