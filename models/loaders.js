var mongoClient = require("mongodb").MongoClient,
    assert = require("assert");

exports.databaseInfo = {
    "host":"localhost",
    "port":27017,
    "database":"codeplex",
    "content-database":"codeplex-content",
    "collMapping":{
        "users":"users",
        "teams":"teams"
    }
}

exports.mongoConn = function (server, port, db, func){ //params: server: the server host on which mongoDB is, port: the server port, db: the db name, collection: the collection on which to perform actions, func: the callback which executes when connected to the collection
    
    var server     = server     || "localhost",
        port       = port       || 27017,
        db         = db         || "",
        func       = func       || function(){ return [0, "a callback function must be specified"] },
        verbosity  = verbosity  || 1;
    
    function collManagement(err, db){    
        assert.equal(null, err);
        func(db, function(){
            db.close();
        });
    }
    
    var collection = collection;
    
    var url = 'mongodb://' + server + ':'+ port + '/' + db;
    mongoClient.connect(url, collManagement);      
}