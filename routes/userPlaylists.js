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
    newPlaylist.createdByID = user._id;
    newPlaylist.imgUrl = '';

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
        // user.playlists.push(playlist._id);
        var playlistId = playlist._id;
        console.log(playlistId);
        usersCollection.findOneAndUpdate({_id: user._id}, {$push: {playlists: playlistId}}, function (err, docs) {
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

module.exports = router;