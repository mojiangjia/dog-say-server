'use strict'

var uuid = require('uuid');
var xss = require('xss')
var mongoose = require('mongoose');
var sms = require('../util/sms');

var User = mongoose.model('User');

exports.signup = async (ctx, next) => {
	var phoneNumber = xss(ctx.request.body.phoneNumber.trim());
	// var phoneNumber = ctx.query.phoneNumber;

	var user = await User.findOne({
		phoneNumber: phoneNumber
	}).exec();

	var verifyCode = sms.getCode();

	if (!user) {
		user = new User({
			nickname: 'CutieDog',
			phoneNumber: xss(phoneNumber),
			verifyCode: verifyCode,
			accessToken: uuid.v4()
		});
	}
	else {
		user.verifyCode = verifyCode;
	}

	try{
		user = await user.save();
	}
	catch (e) {
		ctx.body = {
			success: false,
			err: 'saving account failed'
		};
		return next;
	}

	var msg = 'Your verification code: ' + verifyCode;
	try {
		await sms.send(phoneNumber, msg);
	}
	catch(e) {
		console.log(e);
		ctx.body = {
			success: false,
			err: 'sms failed'
		};
		return next;
	}
	ctx.body = {
		success: true
	};
}

exports.auth = async (ctx, next) => {
	var phoneNumber = ctx.request.body.phoneNumber;
	var verifyCode = ctx.request.body.verifyCode;

	// if (!phoneNumber || !verifyCode) {
	// 	ctx.body = {
	// 		success: false,
	// 		err: 'verification failed'
	// 	};
	// 	return next;
	// }

	var user = await User.findOne({
		phoneNumber: phoneNumber,
		verifyCode: verifyCode
	}).exec();

	if (user) {
		user.verified = true;
		await user.save();
		ctx.body = {
      success: true,
      data: {
        nickname: user.nickname,
        accessToken: user.accessToken,
        avatar: user.avatar,
        _id: user._id,
        gender: user.gender,
        age: user.age,
        breed: user.breed
      }
    };
	}
	else {
		ctx.body = {
			success: false,
			err: 'verification failed'
		};
	}
}

exports.update = async (ctx, next) => {
	var body = ctx.request.body;
	var accessToken = body.accessToken;

	var user = ctx.session.user;

	var fields = 'avatar,gender,age,nickname,breed'.split(',');

  fields.forEach(function(field) {
    if (body[field]) {
      user[field] = xss(body[field].trim());
    }
  }); 

  user = await user.save();

  ctx.body = {
      success: true,
      data: {
        nickname: user.nickname,
        accessToken: user.accessToken,
        avatar: user.avatar,
        _id: user._id,
        gender: user.gender,
        age: user.age,
        breed: user.breed
      }
    };

}