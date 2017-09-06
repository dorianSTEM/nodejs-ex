exports.renderFile = function (res, fileName, loggedIn, error){ //render one of the files which require basic user info(logged in (true/false)) 
    var error = error || false;
    var loggedIn = loggedIn || false;
    
    res.render(fileName, {
        "error":error,
        "user": {
            "logged_in": loggedIn
        }
    });  
}


exports.renderBareFile = function (res, fileName, sessionID, error){ //render one of the files which require basic user info
    var error = error || false;
    
    checkUserStat(sessionID, function(stat, data){
        if (stat){
            res.render(fileName, {
                "error":error,
                "admin":data["admin"],
                "user": {
                    "logged_in": true,
                    "pic":data["user-icon"],
                    "username":data["username"],
                    "role":data["role"]
                }
            });  
        } else {
            return res.redirect("/account");
        }
        
    });
}


exports.parseCookies = function(request) { //function to get cookies
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
