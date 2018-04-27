const express = require('express');
const router = express.Router();


//Logout
router.get('/', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            res.status(500);
            res.json({err: err});
        } else {
            res.status(200);
            res.json({message: "success"});
        }
    });
});


module.exports = router;