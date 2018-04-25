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

    usersCollection.insert(newUser, function (err, data) {
        res.json({id: data._id});
    });
});

module.exports = router;
