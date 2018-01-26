'use strict'

var cloudinary = require('cloudinary');
var Promise = require('bluebird');
var config = require('../../config/config');

cloudinary.config(config.cloudinary);

exports.uploadToCloudinary = function (url) {
	return new Promise(function (resolve, reject) {
		cloudinary.v2.uploader.upload(url, {
			resource_type: 
		},function (err, result) {
			if (!err) {
				resolve(result);
			}
		})
	});
}