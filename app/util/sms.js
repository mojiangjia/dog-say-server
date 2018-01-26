'use strict'

var twilio = require('twilio');
var speakeasy = require('speakeasy');
var config = require('../../config/config');

var accountSid = config.twilio.accountSid; // Your Account SID from www.twilio.com/console
var authToken = config.twilio.authToken;   // Your Auth Token from www.twilio.com/console

var client = new twilio(accountSid, authToken);

exports.getCode = function () {
	var code = speakeasy.totp({
		secret: 'dogbark',
		digits: 4
	});
	return code;
};

exports.send = function (phoneNumber, msg) {

	return client.messages.create({
	    body: msg + '. [DogSays]',
	    to: phoneNumber,  // Text to this number
	    from: '+18569972931' // From a valid Twilio number
	})
	.then((message) => console.log(message.sid));
}
