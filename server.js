var express = require("express");

var app = express();
var port = 8080

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var users = require("./users").init(io);

var games = []
var waitingList = []

app.set('view engine', 'ejs'); //set view engine for templates
app.set('views', __dirname + '/views'); //set views directory

app.use(require('./controllers')); //routes
app.use(express.static('public')); //css,javascript,etc

app.use(require('./middlewares/404-handler')); // If we got this far, the page was not found on the server

app.listen(port, function(){ //listen
  console.log("server is listening on port " + port);
});
