const express = require('express');
const router = express.Router();


//Get playlists created by selected user
router.get('/:id', function (req, res, next) {
    var playlistsCollection = req.db.get('playlists');
    var userID = req.params.id;

    playlistsCollection.find({createdByID: userID}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json(docs);
        }
    });
});

//
// //Add  playlist
// router.post('/', function (req, res, next) {
//     var playlistsCollection = req.db.get('playlists');
//     var newPlaylist = req.body;
//     newPlaylist.uploadedBy = req.session.user.username;
//     newPlaylist.uploadedByID = req.session.user._id;
//     newPlaylist.comments = [];
//     newPlaylist.viewCount = 0;
//     newPlaylist.likeCount = 0;
//     newPlaylist.dislikeCount = 0;
//     newPlaylist.likedByUserIDs = [];
//     newPlaylist.dislikedByUserIDs = [];
//
//
//     videosCollection.insert(newVideo, function (err, data) {
//         if (!err) {
//             var videoId = data._id;
//             updateUserUploadedVideos(videoId);
//         } else {
//             res.status(500);
//             res.json({err: err});
//         }
//     });
//
//     function updateUserUploadedVideos(videoId) {
//         var usersCollection = req.db.get('users');
//         var user = req.session.user;
//         user.uploadedVideos.push(videoId);
//
//         usersCollection.update({_id: user._id}, user, function (err, docs) {
//             if (!err) {
//                 res.status(200);
//                 res.json(videoId);
//             } else {
//                 res.status(500);
//                 res.json({err: err});
//             }
//         });
//     }
//
// });

module.exports = router;