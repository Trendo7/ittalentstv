const express = require('express');
const router = express.Router();


//Get videos uploaded by selected user
router.get('/:id', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var userID = req.params.id;

    videosCollection.find({uploadedByID: userID}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json(docs);
        }
    });
});

module.exports = router;