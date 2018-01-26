'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

var VideoSchema = new Schema({
	author: {
		type: ObjectId,
		ref: 'User'
	},

	public_id: String,
	detail: Mixed,

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

VideoSchema.pre('save', function (next) {
	if (!this.isNew) {
		this.meta.updateAt = Date.now();
	}
	next();
});


module.exports = mongoose.model('Video', VideoSchema);


