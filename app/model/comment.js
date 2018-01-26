'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

var CommentSchema = new Schema({
	replyBy: {
		type: ObjectId,
		ref: 'User'
	},

	replyTo: {
		type: ObjectId,
		ref: 'User'
	},

	creation: {
		type: ObjectId,
		ref: 'Creation'
	},
	
	content: String,

	reply: [{
    from: {type: ObjectId, ref: 'User'},
    to: {type: ObjectId, ref: 'User'},
    content: String
  }],

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

CommentSchema.pre('save', function (next) {
	if (!this.isNew) {
		this.meta.updateAt = Date.now();
	}
	next();
});


module.exports = mongoose.model('Comment', CommentSchema);


