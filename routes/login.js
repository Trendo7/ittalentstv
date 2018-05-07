const express = require('express');
const router = express.Router();
const sha1 = require('sha1');


//Login
router.post('/', function (req, res, next) {
    var usersCollection = req.db.get('users');
    var user = req.body;
    const NAME_MIN_LENGTH = 4;
    const PASSWORD_MIN_LENGTH = 8;

    if ((!user.username) || (String(user.username).trim().length < NAME_MIN_LENGTH) ||
        (!user.password) || (String(user.password).trim().length < PASSWORD_MIN_LENGTH)) {
        res.status(401);
        res.json({
            error: "Oops! Wrong username or password. Try again!"
        });
        return;
    }

    user.password = sha1(user.password);

    usersCollection.findOne({username: user.username, password: user.password}, {}, function (err, docs) {
        if (!err) {
            if (!!docs) {
                req.session.user = docs;
                res.status(200);
                res.json({
                    userId: docs._id,
                    username: docs.username,
                    imageUrl: docs.imageUrl
                });

            } else {
                res.status(401);
                res.json({
                    error: "Oops! Wrong username or password. Try again!"
                });
            }
        } else {
            res.status(500);
            res.json({err: err});
        }
    });

});


module.exports = router;