var io;
var games = []

var waitingPlayers = []
var gameID = 0;

function checkDoubles(name){
    for (game in games){
        for (player in games[game]){
            if (player.name == name){
                return false;
            } 
        }
    }
    
    for (player in waitingPlayers){
        if (waitingPlayers[player].name == name){
            return false;
        }
    }
    
    return true;
}

function joinGame(name, socket){
    waitingPlayers.push({name:name, direction:0, sock:socket}); // always add to waiting list (with socket so that messages can be resent)
    
    if (waitingPlayers.length == 2) { // check if waiting list is full (2 players for pong)
        console.log("waiting list is full");
        var gameInfo = {"players":waitingPlayers, "gameID":gameID}; //generate new game info
        games.push(gameInfo); //add the game info to the games array
        
        var slope = [Math.floor(Math.random()*3)+2, Math.floor(Math.random()*3)+2];
        
        for (player in waitingPlayers){
            var side = player;
            
            if (player == 0){
                var opName = waitingPlayers[1].name;
            } else {
                var opName = waitingPlayers[0].name;
            }
            
            waitingPlayers[player].sock.emit("ready", {gameID:gameID, side:side, opName:opName, ballSlope:slope}); //send ready event to all players in a game
        }
        
        waitingPlayers = []; //clear the waiting list
        gameID++; // increase gameID so that it stays unique
        
    } else if (waitingPlayers.length > 2){ //in case there are more than two players
        waitingPlayers.player.sock.emit("error", {"errInfo":"More than two players to a game error, please try again"});
        waitingPlayers = [] //just clear them
    }
}



exports.init = function(io_var){
    io = io_var;
    io.on('connection', function (socket) {
        socket.emit("speak", {});
        socket.on('join', function (data) {
            if (true){ //check if name has already been picked
                joinGame(data.name, socket);
            }
        });
        socket.on("change-direction", function(data){
            console.log("called");
            console.log(gameID);
            for (game in games){ //check every game
                console.log("found game with id " + games[game].gameID);
                if (games[game].gameID == data.gameID){ //if it is the mentioned game 
                    var currGame = games[game];
                    console.log("found Game");
                    for (player in currGame.players){ //check the players
                        if (currGame.players[player].sock != socket){
                            console.log("emit");
                            currGame.players[player].sock.emit("new-direction", {direction:data.direction}) //tell them the new slope
                        }
                    }
                    break;
                }
            }
        });
    });
}
