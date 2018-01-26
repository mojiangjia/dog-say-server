'use strict'

var _ = require('lodash');
var xss = require('xss');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = mongoose.model('User');
var Video = mongoose.model('Video');
var Audio = mongoose.model('Audio');
var Creation = mongoose.model('Creation');
var config = require('../../config/config');

// http://res.cloudinary.com/dogsays/video/upload/e_volume:-100/e_volume:400,l_video:audio:dogsays_qenhjj/video/hja3rcm6kudld6nhepqu.mp4 


exports.video = async (ctx, next) => {
	var body = ctx.request.body;
	var videoData = body.video;
	var user = ctx.session.user;

	if (!videoData || !videoData.public_id) {
    ctx.body = {
      success: false,
      err: 'uploading video failed'
    }
    return next
  }

  var video = await Video.findOne({
  	public_id: videoData.public_id
  }).exec();

  if (!video) {
  	video = new Video({
  		author: user._id,
  		public_id: videoData.public_id,
  		detail: videoData
  	});
	  video = await video.save();
  }


	ctx.body = {
		success: true,
		data: video._id
	};
};

exports.audio = async (ctx, next) => {
	var body = ctx.request.body;
	var audioData = body.audio;
	var videoId = body.videoId;
	var user = ctx.session.user;

	if (!audioData || !audioData.public_id) {
    ctx.body = {
      success: false,
      err: 'uploading audio failed'
    }
    return next
  }

  var video = await Video.findOne({
  	_id: videoId
  }).exec();

  if (!video) {
  	ctx.body = {
  		success: false,
  		err: 'no corresponding video'
  	};
  	return next;
  }

  var audio = await Audio.findOne({
  	public_id: audioData.public_id
  }).exec();

  if (!audio) {

  	var video_public_id = video.public_id;
	  var audio_public_id = audioData.public_id.replace(/\//g, ':');
	  var videoURL = 'http://res.cloudinary.com/dogsays/video/upload/e_volume:-100/e_volume:400,l_video:' + audio_public_id + '/' + video_public_id + '.mp4';
	  var thumbURL = 'http://res.cloudinary.com/dogsays/video/upload/' + video_public_id + '.jpg';

  	var _audio = {
  		author: user._id,
  		video: video._id,
  		public_id: audioData.public_id,
  		detail: audioData,
  		creation_url: videoURL,
  		creation_thumb: thumbURL
  	};
		
		audio = new Audio(_audio);
	  audio = await audio.save();
  }

  // http://res.cloudinary.com/dogsays/video/upload/e_volume:-100/e_volume:400,l_video:audio:dogsays_qenhjj/video/hja3rcm6kudld6nhepqu.mp4 

	ctx.body = {
		success: true,
		data: audio._id
	};
};

exports.save = async (ctx, next) => {
	var body = ctx.request.body;
	var videoId = body.videoId;
	var audioId = body.audioId;
	var title = body.title;
	var user = ctx.session.user;

	var video = await Video.findOne({
		_id: videoId
	}).exec();

	var audio = await Audio.findOne({
		_id: audioId
	}).exec();

	if (!video || !audio) {
		ctx.body = {
  		success: false,
  		err: 'no corresponding video or audio'
  	};
  	return next;
	}

	var creation = await Creation.findOne({
		video: videoId,
		audio: audioId
	}).exec();

	if (!creation) {
		var _creation = {
			author: user._id,
			title: xss(title),
			audio: audioId,
			video: videoId,
			creation_url: audio.creation_url,
			creation_thumb: audio.creation_thumb,
		}

		creation = new Creation(_creation);
		await creation.save();
	}

	ctx.body = {
		success: true,
    data: {
      _id: creation._id,
      title: creation.title,
      creation_url: creation.creation_url,
      creation_thumb: creation.creation_thumb,
      author: {
        avatar: user.avatar,
        nickname: user.nickname,
        gender: user.gender,
        breed: user.breed,
        _id: user._id
      }
    }
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
	var page = parseInt(ctx.query.page, 10) || 1;
	var count = 5;
	var offset = (page - 1) * count;

	var queryArray = [
    Creation
      .find({})
      .sort({
        'meta.createAt': -1
      })
      .skip(offset)
      .limit(count)
      .populate('author', userFields.join(' '))
      .exec(),
    Creation.count({}).exec()
  ];

  var data = await Promise.all(queryArray);
	var creations = data[0];
	var total = data[1];

	ctx.body = {
		success: true,
		data: creations,
		total: total
	}
}

exports.like = async (ctx, next) => {
  var body = ctx.request.body;
  var user = ctx.session.user;
  var id = body._id;

  var creation = await Creation.findOne({
    _id: id
  }).exec();

  if (!creation) {
    ctx.body = {
      success: false,
      err: 'cannot find video'
    }
    return next;
  }

  if (body.like === 'yes') {
    creation.likes = creation.likes.concat([String(user._id)]);
  } else {
    creation.likes = _.without(creation.likes, String(user._id));
  }

  creation.up = creation.likes.length;

  await creation.save();

  ctx.body = {
    success: true,
  }
}



