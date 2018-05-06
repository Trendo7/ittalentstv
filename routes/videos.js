const express = require('express');
const router = express.Router();
const MONGO_ID_LENGTH = 24;

//Get all videos
router.get('/', function (req, res, next) {
    var videosCollection = req.db.get('videos');

    videosCollection.find({}, {title: 1, thumbnailUrl: 1, uploadedBy: 1, uploadedByID: 1, viewCount: 1, uploadDate: 1}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json(docs);
        }
    });
});


//Get playlist videos (selected videos by id)
router.post('/byPlaylist/', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var videoIDs = req.body.videoIDs;

    videosCollection.find({_id: {$in: videoIDs}}, {title: 1, thumbnailUrl: 1, uploadedBy: 1, uploadedByID: 1, viewCount: 1, uploadDate: 1}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            docs.sort(function (a, b) {
                return videoIDs.indexOf(a._id.toString()) - videoIDs.indexOf(b._id.toString());
            });

            res.status(200);
            res.json(docs);
        }
    });
});

//Get selected video (by its ID) and increment the viewCount
router.get('/:id', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var videoToGetID = req.params.id;

    if (videoToGetID.trim().length != MONGO_ID_LENGTH) {
        res.status(404);
        res.json({err: "This page isn't available. Sorry about that.Try searching for something else."});
        return;
    }

    videosCollection.findOneAndUpdate({_id: videoToGetID}, {$inc: {viewCount: 1}}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            if (docs === null) {
                res.status(404);
                res.json({err: "This page isn't available. Sorry about that.Try searching for something else."});
            } else {
                res.status(200);
                res.json(docs);
            }
        }
    });
});


//Update video rate
router.put('/rate/:id', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var usersCollection = req.db.get('users');
    var videoToUpdateID = req.params.id;
    var vote = req.body.vote;
    var user = req.session.user;

    if (!user) {
        res.status(401);
        res.json({err: "Please login to rate this video!"});
        return;
    }

    var isMyVideo = !!user.uploadedVideos.find(v => v === videoToUpdateID);
    if (isMyVideo) {
        res.status(403);
        res.json({err: "You can not rate this video as you are the uploader!"});
        return;
    }

    var isLikedByMe = !!user.likedVideos.find(videoId => videoId === videoToUpdateID);
    var isDislikedByMe = !!user.dislikedVideos.find(videoId => videoId === videoToUpdateID);

    var userID = user._id;
    var likeC = 0;
    var dislikeC = 0;
    var videoOptions = {};
    var userOptions = {};
    if (vote) {
        if (isLikedByMe) {
            likeC = -1;
            videoOptions = {$pull: {likedByUserIDs: user._id}};
            userOptions = {$pull: {likedVideos: videoToUpdateID}};
        } else {
            if (isDislikedByMe) {
                dislikeC = -1;
                likeC = 1;
                videoOptions = {$pull: {dislikedByUserIDs: userID}, $push: {likedByUserIDs: userID}};
                userOptions = {$pull: {dislikedVideos: videoToUpdateID}, $push: {likedVideos: videoToUpdateID}};
            } else {
                likeC = 1;
                videoOptions = {$push: {likedByUserIDs: userID}};
                userOptions = {$push: {likedVideos: videoToUpdateID}};
            }
        }
    } else {
        if (isDislikedByMe) {
            dislikeC = -1;
            videoOptions = {$pull: {dislikedByUserIDs: userID}};
            userOptions = {$pull: {dislikedVideos: videoToUpdateID}};
        } else {
            if (isLikedByMe) {
                likeC = -1;
                dislikeC = 1;
                videoOptions = {$pull: {likedByUserIDs: userID}, $push: {dislikedByUserIDs: userID}};
                userOptions = {$pull: {likedVideos: videoToUpdateID}, $push: {dislikedVideos: videoToUpdateID}};
            } else {
                dislikeC = 1;
                videoOptions = {$push: {dislikedByUserIDs: userID}};
                userOptions = {$push: {dislikedVideos: videoToUpdateID}};
            }
        }
    }
    //before setting videoOptions we used this argument ->>> {$inc: {likeCount: likeC, dislikeCount: dislikeC}}
    videosCollection.findOneAndUpdate({_id: videoToUpdateID}, videoOptions, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            if (docs === null) {
                res.status(404);
                res.json({err: "This page isn't available. Sorry about that.Try searching for something else."});
            } else {
                usersCollection.findOneAndUpdate({_id: userID}, userOptions, function (errU, docsU) {
                    if (errU) {
                        res.status(500);
                        res.json(err);
                    } else {
                        req.session.user = docsU;
                        res.status(200);
                        res.json(docs);
                    }
                });
            }
        }
    });
});


//Add  video
router.post('/', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var usersCollection = req.db.get('users');
    var user = req.session.user;
    var newVideo = req.body;
    newVideo.uploadedBy = req.session.user.username;
    newVideo.uploadedByID = req.session.user._id;
    newVideo.comments = [];
    newVideo.viewCount = 0;
    newVideo.likeCount = 0;
    newVideo.dislikeCount = 0;
    newVideo.likedByUserIDs = [];
    newVideo.dislikedByUserIDs = [];


    videosCollection.insert(newVideo, function (err, data) {
        if (!err) {
            var videoId = data._id.toString();
            updateUserUploadedVideos(videoId);
        } else {
            res.status(500);
            res.json({err: err});
        }
    });

    function updateUserUploadedVideos(videoId) {
        usersCollection.findOneAndUpdate({_id: user._id}, {$push: {uploadedVideos: videoId}}, function (err, docsU) {
            if (!err) {
                req.session.user = docsU;
                res.status(200);
                res.json(videoId);
            } else {
                res.status(500);
                res.json({err: err});
            }
        });
    }

});

module.exports = router;