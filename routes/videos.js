const express = require('express');
const router = express.Router();

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


//Get single video
router.get('/:id', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var videoToGetID = req.params.id;

    videosCollection.find({_id: videoToGetID}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json(docs);
        }
    });
});


//Delete  video
router.delete('/:id', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var videoToDeleteID = req.params.id;

    videosCollection.remove({_id: videoToDeleteID}, {}, function (err, docs) {
        // console.log(docs);
        // console.log(err);
        res.status(200);
        res.json({message: "success"});
    });

});

//Add  video
router.post('/', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var newVideo = req.body;
    newVideo.uploadedBy = req.session.user.username;
    console.log(req.session.user);
    console.log(1);
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
                res.json({
                    message: 'Video has been uploaded and user uploadedVideo collection has been updated successfully!'
                });
            } else {
                res.status(500);
                res.json({err: err});
            }
        });
    }

});

module.exports = router;