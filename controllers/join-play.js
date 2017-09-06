var express = require("express"),
    router = express.Router();

var helper = require("./helper");

// join request logic
router.post('/join', function(req, res){ //when user requests main page    
    var cookies = helper.parseCookies(req);
    res.cookie('name', req.body.name, { maxAge: 900000, httpOnly: false });
    res.render('join', {});
});

router.get('/join', function(req, res){
    res.redirect("/");
});

module.exports = router;