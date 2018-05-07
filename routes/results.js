var express = require('express');
var router = express.Router();


//Get search results
router.get('/:searchQuery', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var searchPhrase = req.params.searchQuery.toLowerCase().trim();
    var keyWords = searchPhrase.split(' ');
    var uniqueKeyWords = keyWords.filter(function (elem, pos, arr) {
        return arr.indexOf(elem) == pos;
    });
    console.log(searchPhrase);
    console.log(uniqueKeyWords);

    videosCollection.find({$or: [{title: new RegExp(searchPhrase, 'i')}, {tags: {$in: uniqueKeyWords}}]}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json(docs);
            console.log(docs);
        }
    });
});


module.exports = router;