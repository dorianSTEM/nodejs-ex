var socket = io.connect('http://127.0.0.1:8000');
            
var name = document.cookie.split("=")[1];

var game;

socket.on("speak", function(data){
    console.log("speaking");
    socket.emit('join', {name:name}); 
});

socket.on("ready", function(data){
    var game = new Game(data.gameID, data.side, data.opName, socket, data.ballSlope);
});

socket.on("error", function(data){
    $("#message").html(data["errInfo"]);
});
