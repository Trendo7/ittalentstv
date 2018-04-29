const express = require('express');
const router = express.Router();


//Get my videos
router.get('/', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var user = req.session.user;

    videosCollection.find({uploadedBy: user.username}, {title: 1, description: 1, thumbnailUrl: 1, uploadedBy: 1, viewCount: 1, tags: 1}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json(docs);
        }
    });
});


//Update my video
router.put('/:id', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var videoToUpdate = req.body;
    var videoToUpdateID = req.params.id;
    var user = req.session.user;

    var isMyVideo = user.uploadedVideos.find(function (videoId) {
        return videoId === videoToUpdateID;
    });

    if (!isMyVideo) {
        res.status(401);
        res.json({err: "You are not authorized to edit the selected video!"});
        return;
    }

    videosCollection.update({_id: videoToUpdateID}, {$set: videoToUpdate}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({message: "The video has been updated successfully."});
        }
    });

});


//Delete my video
router.delete('/:id', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var videoToDeleteID = req.params.id;
    var usersCollection = req.db.get('users');
    var user = req.session.user;

    var isMyVideo = user.uploadedVideos.find(function (videoId) {
        return videoId === videoToDeleteID;
    });

    if (!isMyVideo) {
        res.status(401);
        res.json({err: "You are not authorized to delete the selected video!"});
        return;
    }

    videosCollection.remove({_id: videoToDeleteID}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            var videoIndex = user.uploadedVideos.findIndex(function (videoId) {
                return videoId === videoToDeleteID;
            });
            user.uploadedVideos.splice(videoIndex, 1);
            updateUser();
        }
    });

    function updateUser() {
        usersCollection.update({_id: user._id}, user, function (err, docs) {
            if (!err) {
                res.status(200);
                res.json({message: "The video has been deleted successfully."});
            } else {
                res.status(500);
                res.json({err: err});
            }
        });
    }

});

module.exports = router;