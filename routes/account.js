const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

//Get account details
router.get('/', function (req, res, next) {
    var usersCollection = req.db.get('users');
    var user = req.session.user;

    usersCollection.findOne({_id: user._id}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json(docs);
        }
    });
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

    usersCollection.findOne({username: user.username}, {}, function (err, docs) {
        if (!err) {
            if ((docs != null) && (req.session.user.username != user.username)) {
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
        usersCollection.findOneAndUpdate({_id: user._id}, user, function (err, docs) {
            if (!err) {
                req.session.user = docs;
                res.status(200);
                res.json({
                    userId: docs._id,
                    username: docs.username,
                    imageUrl: docs.imageUrl
                });
            } else {
                res.status(500);
                res.json({err: err});
            }
        });
    }
});

module.exports = router;