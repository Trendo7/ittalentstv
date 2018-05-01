const express = require('express');
const router = express.Router();

//Get account details
router.get('/:keyWords', function (req, res, next) {
    var videosCollection = req.db.get('videos');
    var keyWords = req.params.keyWords;
    console.log(keyWords);


    // ( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
    // videosCollection.find({title: keyWords, tags: keyWords}, {title: 1, tags: 1}, function (err, docs) {
    // '^' +search + '$'
    videosCollection.find({$or: [{title: new RegExp(keyWords, 'i')}, {tags: new RegExp(keyWords, 'i')}]}, {title: 1, tags: 1, _id: 0}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json(err);
            console.log(err);
        } else {
            res.status(200);
            res.json(docs);
            console.log(docs);
        }
    });
});
 
module.exports = router;