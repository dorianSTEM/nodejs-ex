var express = require("express");

module.exports = function(req, res){
    res.render('404Error' , {
        "user": {
            "logged_in": false
        }
    });
}
