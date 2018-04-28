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
            error: 'Please enter username!'
        });
        return;
    }

    if (String(user.password).trim().length < 8) {
        res.status(412);
        res.json({
            error: 'Your password must be at least 8 characters long!'
        });
        return;
    }

    user.password = sha1(user.password);

    usersCollection.find({username: user.username}, {}, function (err, docs) {
        if (!err) {
            console.log(docs[0]);
            if ((docs.length > 0) && (req.session.user.username != user.username)) {
                res.status(409);
                res.json({
                    error: "This username is already in use! Please choose another one!"
                });
                return;
            } else {
                updateUser();
            }
        } else {
            res.status(500);
            res.json({err: err});
        }
    });

    function updateUser() {
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
    }
});

module.exports = router;