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

//Create playlist
router.post('/', function (req, res, next) {
    var playlistsCollection = req.db.get('playlists');
    var usersCollection = req.db.get('users');
    var newPlaylist = req.body;
    var user = req.session.user;
    newPlaylist.title = '';
    newPlaylist.createdByID = user._id;
    newPlaylist.videos = [];
    newPlaylist.imgUrl = '';

    if (!user) {
        res.status(401);
        res.json({err: "Please login to create your own playlist!"});
        return;
    }

    playlistsCollection.find({title: newPlaylist.title, createdByID: newPlaylist.title}, {}, function (err, docs) {
        if (!err) {
            if (docs.length > 0) {
                res.status(409);
                res.json({
                    error: "You already have playlist with such name!"
                });
                return;
            } else {
                createPlaylist();
            }
        } else {
            res.status(500);
            res.json({err: err});
        }
    });

    function createPlaylist() {
        playlistsCollection.insert(newPlaylist, function (err, data) {
            if (!err) {
                console.log('createPlaylist function');
                console.log(data);
                console.log();
                updateUserPlaylists(newPlaylist);
            } else {
                res.status(500);
                res.json({err: err});
            }
        });
    }

    function updateUserPlaylists(playlist) {
        user.playlists.push(playlist._id);

        usersCollection.update({_id: user._id}, user, function (err, docs) {
            if (!err) {
                res.status(200);
                console.log('usersCollection.update');
                console.log(docs);
                console.log();
                res.json(playlist);
            } else {
                res.status(500);
                res.json({err: err});
            }
        });
    }

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