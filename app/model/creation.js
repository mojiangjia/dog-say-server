'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

var CreationSchema = new Schema({
	author: {
		type: ObjectId,
		ref: 'User'
	},

	video: {
		type: ObjectId,
		ref: 'Video'
	},

	audio: {
		type: ObjectId,
		ref: 'Audio'
	},

	title: String,
	creation_thumb: String,
	creation_url: String,

	likes: [String],
	up: {
		type: Number,
		default: 0
	},

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

CreationSchema.pre('save', function (next) {
	if (!this.isNew) {
		this.meta.updateAt = Date.now();
	}
	next();
});


module.exports = mongoose.model('Creation', CreationSchema);


