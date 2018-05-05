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


//toggle song in the selected playlist
router.put('/:id', function (req, res, next) {
    var playlistsCollection = req.db.get('playlists');
    var playlistID = req.params.id;
    var videoID = req.body.videoId;
    var isChecked = req.body.isChecked;

    var playlistOptions = {};
    var message = '';
    if (isChecked) {
        playlistOptions = {$push: {videos: videoID}};
        message = 'Added to playlist';
    } else {
        playlistOptions = {$pull: {videos: videoID}};
        message = 'Removed from playlist';
    }

    playlistsCollection.findOneAndUpdate({_id: playlistID}, playlistOptions, function (err, docs) {
        if (!err) {
            res.status(200);
            res.json({message: message});
        } else {
            res.status(500);
            res.json({err: err});
        }
    });

});


//Create playlist
router.post('/', function (req, res, next) {
    var playlistsCollection = req.db.get('playlists');
    var usersCollection = req.db.get('users');
    var newPlaylist = req.body;
    var user = req.session.user;
    newPlaylist.createdByID = user._id;
    newPlaylist.imgUrl = 'https://theplaylist.net/wp-content/uploads/2016/05/the-playlist.jpg';

    if (!user) {
        res.status(401);
        res.json({err: "Please login to create your own playlist!"});
        return;
    }

    playlistsCollection.insert(newPlaylist, function (err, data) {
        if (!err) {
            updateUserPlaylists(data);
        } else {
            res.status(500);
            res.json({err: err});
        }
    });

    function updateUserPlaylists(playlist) {
        usersCollection.findOneAndUpdate({_id: user._id}, {$push: {playlists: playlist._id}}, function (err, docs) {
            if (!err) {
                res.status(200);
                res.json(playlist);
            } else {
                res.status(500);
                res.json({err: err});
            }
        });
    }

});

module.exports = router;