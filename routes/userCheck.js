const express = require('express');
const router = express.Router();
const MONGO_ID_LENGTH = 24;


//Check if selected user exists and provides user data
router.get('/:id', function (req, res, next) {
    var usersCollection = req.db.get('users');
    var userID = req.params.id;

    if (userID.trim().length != MONGO_ID_LENGTH) {
        res.status(404);
        res.json({err: "This page isn't available. Sorry about that.Try searching for something else."});
        return;
    }

    usersCollection.findOne({_id: userID}, {username: 1, imageUrl: 1, uploadedVideos: 1}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            if (docs === null) {
                res.status(404);
                res.json({err: "This page isn't available. Sorry about that.Try searching for something else."});
            } else {
                res.status(200);
                res.json(docs);
            }
        }
    });

});

module.exports = router;