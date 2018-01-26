'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

var AudioSchema = new Schema({
	author: {
		type: ObjectId,
		ref: 'User'
	},

	video: {
		type: ObjectId,
		ref: 'Video'
	},

	public_id: String,
	detail: Mixed,

	creation_url: String,
	creation_thumb: String,

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

AudioSchema.pre('save', function (next) {
	if (!this.isNew) {
		this.meta.updateAt = Date.now();
	}
	next();
});


module.exports = mongoose.model('Audio', AudioSchema);


