'use strice'

var xss = require('xss')
var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.signup = async ctx => {
	// var phoneNumber = this.request.body.phoneNumber;
	var phoneNumber = ctx.query.phoneNumber;
	console.log(phoneNumber);
	var user = await User.findOne({
		phoneNumber: phoneNumber
	}).exec();

	if (!user) {
		user = new User({
			phoneNumber: xss(phoneNumber)
		});
	}
	else {
		user.verifyCode = '1212';
	}

	try{
		user = await user.save();
	}
	catch (e) {
		ctx.body = {
			success: false
		};
		return
	}

	ctx.body = {
		success: true
	};
}

exports.auth = async ctx => {
  ctx.body = 'Hello World';
}

exports.update = async ctx => {
  ctx.body = 'Hello World';
}