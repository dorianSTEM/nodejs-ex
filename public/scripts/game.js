var winHeight = 400;
var winWidth = 750;


$("#game-canvas").attr("width", winWidth+"px");
$("#game-canvas").attr("height", winHeight+"px");

var myDirection = 0;
var opponentDirection = 0;
var gameID;

var globSocket; //change this later (if time permits)

var i = 0;

var myScore = 0;
var opScore = 0;
var playing = true;

function Game(gameID, side, opName, socket, slope){
    gameID = gameID;
    this.side = side;
    
    this.socket = socket;
    globSocket = socket; //global variables are BAD, change this if you have time
    
    console.log(slope)
    
    this.opName = opName;
    
    this.screenDimens = [winWidth, winHeight];
    
    var canvas = document.getElementById("game-canvas");
    this.ctx = canvas.getContext("2d");
    
    if (this.side == 0){ //if on left side
        this.myPosition = [this.screenDimens[0]/10, this.screenDimens[1]/2];
        this.opPosition = [this.screenDimens[0]-this.screenDimens[0]/10, this.screenDimens[1]/2];
    } else { //if on right side
        this.myPosition = [this.screenDimens[0]-this.screenDimens[0]/10, this.screenDimens[1]/2];
        this.opPosition = [this.screenDimens[0]/10, this.screenDimens[1]/2];
    }
    
    this.paddleHeight = 75;
    this.paddleWidth = 10;
    
    this.ballPos = [this.screenDimens[0]/2, this.screenDimens[1]/2];
    this.ballSlope = slope;
    //this.ballSlope = [-1, 0];
    this.ballSize = 30;
    
    socket.on("opponent-direction", function(data){
        this.opponentDirection = data.direction;
    });
    
    this.drawCenterLine = function(that){
        var y = 0;
        that.ctx.fillStyle = "#ffffff";
        while (y < this.screenDimens[1]){
            that.ctx.fillRect((this.screenDimens[0]/2)-5, y, 5, 10);
            y += 15;
        }
    }
    
    this.clear = function(that){
        that.ctx.fillStyle = "#000000";
        that.ctx.fillRect(0, 0, this.screenDimens[0], this.screenDimens[0]);
    }
    
    this.drawPaddles = function(that) {
        that.ctx.fillRect(Math.round(this.myPosition[0]-this.paddleWidth/2), Math.round(this.myPosition[1]-this.paddleHeight/2), this.paddleWidth, this.paddleHeight);
        
        that.ctx.fillRect(Math.round(this.opPosition[0]-this.paddleWidth/2), Math.round(this.opPosition[1]-this.paddleHeight/2), this.paddleWidth, this.paddleHeight);
    }
    
    this.detectPaddleBounce = function (that){
        if (that.ballPos[0] >= that.myPosition[0]-that.paddleWidth/2 &&
            that.ballPos[0]-that.ballSize/2 <= that.myPosition[0]+that.paddleWidth/2 &&
            that.ballPos[1] >= that.myPosition[1]-that.paddleHeight/2 && 
            that.ballPos[1] <= that.myPosition[1]+that.paddleHeight/2){
    
            that.ballSlope[0]*=-1;
            
        } else if (that.ballPos[0] >= that.opPosition[0]-that.paddleWidth/2 &&
                   that.ballPos[0]-that.ballSize/2 <= that.opPosition[0]+that.paddleWidth/2 &&
                   that.ballPos[1] >= that.opPosition[1]-that.paddleHeight/2 &&
                   that.ballPos[1] <= that.opPosition[1]+that.paddleHeight/2){
            
            that.ballSlope[0]*=-1;
            
        }
    }
    
    this.checkPaddleBounds = function(that){
        var failures = []
        
        if (that.myPosition[1]+that.paddleHeight/2+myDirection >= that.screenDimens[1] || that.myPosition[1]-that.paddleHeight/2+myDirection <= 0){
            failures.push("me");
        } if (that.opPosition[1]+that.paddleHeight/2+opponentDirection >= that.screenDimens[1] || that.opPosition[1]-that.paddleHeight/2+opponentDirection <= 0){
            failures.push("op");
        }
        
        if (failures.length == 0){
            return true;
        } else {
            return failures;
        }
        
    }
    
    this.drawball = function (that){
        that.ctx.fillStyle = "#ffffff";
        that.ctx.fillRect(that.ballPos[0]-Math.floor(that.ballSize/2), that.ballPos[1]-Math.floor(that.ballSize/2), Math.floor(that.ballSize/2), Math.floor(that.ballSize/2));
    }
    
    this.reset = function(){
        this.ballPos = [this.screenDimens[0]/2, this.screenDimens[1]/2];
    }
    
    this.updateBall = function (that){
        if (that.ballPos[0] + that.ballSlope[0] >= that.screenDimens[0]) {
            if (this.side == 0){
                opScore += 1;
            } else {
                myScore += 1;
            }
            
            this.reset();            
        } else if (that.ballPos[0] + that.ballSlope[0] <= 0){
            if (this.side != 0){
                opScore += 1;
            } else {
                myScore += 1;
            }
            this.reset();
            this.ballSlope[0]*=-1;
            
        } else if (that.ballPos[1] + that.ballSlope[1] >= that.screenDimens[1] || that.ballPos[1] + that.ballSlope[1] <= 0){
            that.ballSlope[1] *= -1
        }
        that.ballPos[0] += that.ballSlope[0];
        that.ballPos[1] += that.ballSlope[1];
        
        $("#myScore").html(myScore);
        $("#opScore").html(opScore);
        
        if (opScore == 3){
            alert("end of game!");
            playing = false;
        }
         else if (myScore == 3){
             alert("end of game!")
             playing = false;
         }
    }
    
    this.update = function(that){
        var bounds = that.checkPaddleBounds(that); 
        if (bounds != true){
            if (bounds.length != 2){
                if (bounds[0] == "op"){
                    that.myPosition[1] += myDirection;
                } else {
                    that.opPosition[1] += opponentDirection;
                }
            } 
        } else {
            that.myPosition[1] += myDirection;
            that.opPosition[1] += opponentDirection;
        }
        
    
        that.clear(that);
        
        that.detectPaddleBounce(that);
        
        that.drawCenterLine(that);
        that.drawPaddles(that);
        that.drawball(that);
        that.updateBall(that);
        
        if (playing){
            setTimeout(function () { that.update (that); }, 20);   
        }
    }
    
    this.init = function(){
        $("title").html("Pong");
        
        $("#game").css({"display":"inline-block"})
        
        $("#loading").css("display", "none");
        
        $("#myName").html(name);
        $("#opName").html(this.opName);
        
        console.log("My side is " + this.side);
        
        if (this.side == 1){
            console.log("I'm on the left")
            $("#myName").addClass("left");
            $("#opName").addClass("right");
            
            $("#myScore").addClass("left");
            $("#opScore").addClass("right");
        } else {
            console.log("I'm on the right")
            $("#myName").addClass("right");
            $("#opName").addClass("left");
            
            $("#myScore").addClass("right");
            $("#opScore").addClass("left");
        }
        
        
        this.update(this);
    }
    
    $(window).keydown(function(event) {
        if (event.which == 40){ //key down
            myDirection = 3;
        } else if (event.which == 38) { //key up
            myDirection = -3;
        }
        this.socket.emit("change-direction", {gameID:gameID, direction:myDirection});
        
    });
    
    $(window).focus(function() {
      console.log( "Handler for .focus() called." );
    });
    
    this.socket.on("new-direction", function(data){
        console.log("got new direction " + data.direction);
        
        opponentDirection = Number(data.direction);
    });
    
    this.init();
    
}