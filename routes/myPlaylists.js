const express = require('express');
const router = express.Router();


//Get my playlists
router.get('/', function (req, res, next) {
    var playlistsCollection = req.db.get('playlists');
    var user = req.session.user;

    playlistsCollection.find({createdByID: user._id}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json(docs);
        }
    });
});


//Update my playlist
router.put('/:id', function (req, res, next) {
    var playlistsCollection = req.db.get('playlists');
    var playlistToUpdate = req.body;
    var playlistToUpdateID = req.params.id;
    var user = req.session.user;

    var isMyPlaylist = user.playlists.find(function (playlistId) {
        return playlistId === playlistToUpdateID;
    });

    if (!isMyPlaylist) {
        res.status(401);
        res.json({err: "You are not authorized to edit the selected video!"});
        return;
    }

    playlistsCollection.update({_id: playlistToUpdateID}, {$set: playlistToUpdate}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({message: "The playlist has been updated successfully."});
        }
    });

});


//Delete my playlist
router.delete('/:id', function (req, res, next) {
    var playlistsCollection = req.db.get('playlists');
    var usersCollection = req.db.get('users');
    var playlistToDeleteID = req.params.id;
    var user = req.session.user;

    var isMyPlaylist = user.playlists.find(function (playlistId) {
        return playlistId === playlistToDeleteID;
    });

    if (!isMyPlaylist) {
        res.status(401);
        res.json({err: "You are not authorized to delete the selected playlist!"});
        return;
    }

    playlistsCollection.remove({_id: playlistToDeleteID}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            updateUser();
        }
    });

    function updateUser() {
        usersCollection.findOneAndUpdate({_id: user._id}, {$pull: {playlists: playlistToDeleteID}}, function (err, docs) {
            if (!err) {
                req.session.user = docs;
                res.status(200);
                res.json({message: "The playlist has been deleted successfully."});
            } else {
                res.status(500);
                res.json({err: err});
            }
        });
    }

});

module.exports = router;