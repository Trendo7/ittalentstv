const express = require('express');
const router = express.Router();
const sha1 = require('sha1');


//Register new user
router.post('/', function (req, res, next) {
    var usersCollection = req.db.get('users');
    var newUser = req.body;
    newUser.imageUrl = '';
    newUser.playlists = [];
    newUser.uploadedVideos = [];
    newUser.history = [];
    newUser.likedVideos = [];
    newUser.dislikedVideos = [];
    const NAME_MIN_LENGTH = 4;
    const PASSWORD_MIN_LENGTH = 8;

    if ((!newUser.username) || (String(newUser.username).trim().length < NAME_MIN_LENGTH)) {
        res.status(412);
        res.json({
            error: 'Your username must be at least ' + NAME_MIN_LENGTH + ' characters long!'
        });
        return;
    }

    if ((!newUser.password) || (String(newUser.password).trim().length < PASSWORD_MIN_LENGTH)) {
        res.status(412);
        res.json({
            error: 'Your password must be at least ' + PASSWORD_MIN_LENGTH + ' characters long!'
        });
        return;
    }

    if (!newUser.email) {
        res.status(412);
        res.json({
            error: 'Invalid Email Format!'
        });
        return;
    }

    newUser.password = sha1(newUser.password);

    usersCollection.findOne({username: newUser.username}, {}, function (err, docs) {
        if (!err) {
            if (!!docs) {
                res.status(409);
                res.json({
                    error: "This username is already in use! Please choose another one!"
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