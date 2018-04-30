const express = require('express');
const router = express.Router();
const MONGO_ID_LENGTH = 24;

//Get all videos
router.get('/', function (req, res, next) {
    var videosCollection = req.db.get('videos');

    videosCollection.find({}, {title: 1, thumbnailUrl: 1, uploadedBy: 1, viewCount: 1}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
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
router.put('/:id', function (req, res, next) {
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

    var likeC = 0;
    var dislikeC = 0;
    var userOptions = {};
    if (vote) {
        if (isLikedByMe) {
            likeC = -1;
            userOptions = {$pull: {likedVideos: videoToUpdateID}};
        } else {
            if (isDislikedByMe) {
                dislikeC = -1;
                likeC = 1;
                userOptions = {$pull: {dislikedVideos: videoToUpdateID}, $push: {likedVideos: videoToUpdateID}};
            } else {
                likeC = 1;
                userOptions = {$push: {likedVideos: videoToUpdateID}};
            }
        }
    } else {
        if (isDislikedByMe) {
            dislikeC = -1;
            userOptions = {$pull: {dislikedVideos: videoToUpdateID}};
        } else {
            if (isLikedByMe) {
                likeC = -1;
                dislikeC = 1;
                userOptions = {$pull: {likedVideos: videoToUpdateID}, $push: {dislikedVideos: videoToUpdateID}};
            } else {
                dislikeC = 1;
                userOptions = {$push: {dislikedVideos: videoToUpdateID}};
            }
        }
    }

    videosCollection.findOneAndUpdate({_id: videoToUpdateID}, {$inc: {likeCount: likeC, dislikeCount: dislikeC}}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            if (docs === null) {
                res.status(404);
                res.json({err: "This page isn't available. Sorry about that.Try searching for something else."});
            } else {
                usersCollection.findOneAndUpdate({_id: user._id}, userOptions, function (errU, docsU) {
                    if (errU) {
                        res.status(500);
                        res.json(err);
                    } else {
                        // console.log(docsU);
                        req.session.user = docsU;
                        res.status(200);
                        res.json(docs);
                    }
                });
            }
        }
    });
});


//Delete  video
router.delete('/:id', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var videoToDeleteID = req.params.id;

    videosCollection.remove({_id: videoToDeleteID}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({message: "success"});
        }
    });

});


//Add  video
router.post('/', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var newVideo = req.body;
    newVideo.uploadedBy = req.session.user.username;
    newVideo.comments = [];
    newVideo.viewCount = 0;
    newVideo.likeCount = 0;
    newVideo.dislikeCount = 0;

    videosCollection.insert(newVideo, function (err, data) {
        if (!err) {
            var videoId = data._id;
            updateUserUploadedVideos(videoId);
        } else {
            res.status(500);
            res.json({err: err});
        }
    });

    function updateUserUploadedVideos(videoId) {
        var usersCollection = req.db.get('users');
        var user = req.session.user;
        user.uploadedVideos.push(videoId);

        usersCollection.update({_id: user._id}, user, function (err, docs) {
            if (!err) {
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