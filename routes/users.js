const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

//Register new user
router.post('/register', function (req, res, next) {
    var usersCollection = req.db.get('users');
    var newUser = req.body;
    newUser.email = '';
    newUser.playlists = [];
    newUser.uploadedVideos = [];
    newUser.history = [];

    if (newUser.username.trim() == '') {
        res.status(412);
        res.json({
            error: "please enter username"
        });
        return;
    }

    if (String(newUser.password).trim().length < 8) {
        res.status(412);
        res.json({
            error: "the password must have at least 8 characters"
        });
        return;
    }

    newUser.password = sha1(newUser.password);

    usersCollection.find({username: newUser.username}, {}, function (err, docs) {
        if (!err) {
            if (docs.length > 0) {
                res.status(409);
                res.json({
                    error: "there is already such username"
                });
                return;
            } else {
                registerUser();
            }
        } else {
            res.status(500);
            res.json({err: err});
        }
    });

    function registerUser() {
        usersCollection.insert(newUser, function (err, data) {
            if (!err) {
                res.status(200);
                res.json({id: data._id});
            } else {
                res.status(500);
                res.json({err: err});
            }
        });
    }

});

module.exports = router;
