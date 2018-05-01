const express = require('express');
const router = express.Router();


//Get search suggestions
router.get('/:searchWords', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var searchPhrase = req.params.searchWords.toLowerCase().trim();

    videosCollection.find({title: new RegExp(searchPhrase, 'i')}, {title: 1, tags: 1, _id: 0}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            var resultsArr = [];
            for (var i = 0; i < docs.length; i++) {
                if (resultsArr.length < 10) {
                    var title = docs[i].title.toLowerCase();

                    if (title.indexOf(searchPhrase) != -1) {
                        if (resultsArr.indexOf(title) === -1) {
                            resultsArr.push(title);
                        }
                    }

                } else {
                    break;
                }
            }

            res.status(200);
            res.json(resultsArr);
        }
    });
});
 
module.exports = router;