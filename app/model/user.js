'use strict'

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	phoneNumber: {
		unique: true,
		type: String
	},
	areaCode: String,
	verifyCode: String,
	accessToken: String,
	nickname: String,
	gender: String,
	breed: String,
	age: String,
	avatar: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		},
	}
});

UserSchema.pre('save', function (next) {
	if (!this.isNew) {
		this.meta.updateAt = Date.now();
	}
	next();
});


module.exports = mongoose.model('User', UserSchema);


