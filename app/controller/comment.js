'use strict'

var Promise = require('bluebird');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Creation = mongoose.model('Creation');
var Comment = mongoose.model('Comment');


exports.save = async (ctx, next) => {

	var commentData = ctx.request.body.comment;
  var user = ctx.session.user;

  var creation = await Creation.findOne({
    _id: commentData.creation
  }).exec();

  if (!creation) {
    ctx.body = {
      success: false,
      err: 'cannot find video'
    }
    return next;
  }

  var comment;

  if (commentData.cid) {
    comment = await Comment.findOne({
      _id: commentData.cid
    })
    .exec();

    var reply = {
      from: commentData.from,
      to: commentData.tid,
      content: commentData.content
    };

    comment.reply.push(reply);

  }
  else {
    comment = new Comment({
      creation: creation._id,
      replyBy: user,
      replyTo: creation.author,
      content: commentData.content
    });
  }

  comment = await comment.save();

  ctx.body = {
    success: true,
    data: [comment],
  }
}


var userFields = [
  'avatar',
  'nickname',
  'gender',
  'age',
  'breed'
];

exports.list = async (ctx, next) => {

  var id = ctx.query.videoId;

  if (!id) {
    ctx.body = {
      success: false,
      err: 'no id'
    }
    return next;
  }

	// var page = parseInt(ctx.query.page, 10) || 1;
	// var count = 5;
	// var offset = (page - 1) * count;

	var queryArray = [
    Comment.find({
      creation: id
    })
    .populate('replyBy', userFields.join(' '))
    .sort({
      'meta.createAt': -1
    })
    .exec(),
    Comment.count({creation: id}).exec()
  ];

  var data = await Promise.all(queryArray);
	var comments = data[0];
	var total = data[1];

	ctx.body = {
		success: true,
		data: comments,
		total: total
	}
}


