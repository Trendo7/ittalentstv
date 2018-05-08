var express = require('express');
var router = express.Router();


//Get search results by search_query and tags
router.get('/search_query/:searchQuery', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var searchPhrase = req.params.searchQuery.toLowerCase().trim();
    var keyWords = searchPhrase.split(' ');
    var uniqueKeyWords = keyWords.filter(function (elem, pos, arr) {
        return ((arr.indexOf(elem) == pos) && (elem != ''));
    });

    // //provides those titles(videos) in which all search words are found (AND)
    // var regExpArgument = '^';
    // uniqueKeyWords.forEach(function (word) {
    //     regExpArgument += "(?=.*" + word + ")";
    // });
    // regExpArgument += ".*$";
    // var regularExpression1 = new RegExp(regExpArgument, "i");
    // console.log(regularExpression1);

    //provides those titles(videos) in which any search word is found (OR)
    var regularExpression = new RegExp(searchPhrase.replace(/[, ]+/g, " ").trim().replace(/ /g, "|"), "i");
    console.log(regularExpression);

    videosCollection.find({$or: [{title: regularExpression}, {tags: {$in: uniqueKeyWords}}]}, {}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json(docs);
        }
    });
});


//Get search results by tag
router.get('/tags/:tag', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var tag = req.params.tag.toLowerCase().trim();

    videosCollection.find({tags: tag}, {}, function (err, docs) {
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