/* 

controller pilot file-

    1. loads index.ejs when accessed by user
    2. loads all other urls when requested by user

Author: Dorian Cauwe
*/

var express = require("express"),
    router = express.Router();

var helper = require("./helper");

router.use(require('./join-play'));

// index request logic
router.get('/', function(req, res){ //when user requests main page
    var cookies = helper.parseCookies(req);
    res.render('index', {});
});

console.log("index is up"); // info message for testing- to see if all files are imported correctly

module.exports = router; //export this file
