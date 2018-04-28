const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

//Get account details
router.get('/', function (req, res, next) {
    var user = req.session.user;

    res.status(200);
    res.json(user);
});

//Modify account details
router.put('/', function (req, res, next) {
    var usersCollection = req.db.get('users');
    var user = req.body;

    if (user.username.trim() == '') {
        res.status(412);
        res.json({
            error: "please enter username"
        });
        return;
    }

    if (String(user.password).trim().length < 8) {
        res.status(412);
        res.json({
            error: "the password must have at least 8 characters"
        });
        return;
    }

    user.password = sha1(user.password);


    usersCollection.update({_id: user._id}, user, function (err, docs) {
        if (!err) {
            res.status(200);
            res.json({
                userId: user._id,
                username: user.username
            });
        } else {
            res.status(500);
            res.json({err: err});
        }
    });
});

module.exports = router;