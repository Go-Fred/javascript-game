;(function(){
  var Game =  function(canvasId){
    var canvas = document.getElementById(canvasId);
    var screen = canvas.getContext('2d');
    var gameSize = {x: canvas.width, y: canvas.height};
    var Invaders = this.createInvaders(24, gameSize)
    this.bodies = Invaders.concat(new Player(this, gameSize));
    var self = this;

    var tick = function() {
      self.update();
      self.draw(screen, gameSize)
      requestAnimationFrame(tick); //run every 60 seconds
    };

    tick();
  };
  Game.prototype = {
    update: function(){
      var bodies = this.bodies;
      var notCollidingWithAnything = function(b1){
        return bodies.filter(function(b2){return colliding(b1,b2);}).length === 0;
      }
      this.bodies = this.bodies.filter(notCollidingWithAnything)
      for(var i = 0; i < this.bodies.length; i++){
        this.bodies[i].update();
      }
    },
    draw: function(screen, gameSize) {
      screen.clearRect(0,0,gameSize.x,gameSize.y)
      for(var i = 0; i < this.bodies.length; i++){
        drawRect(screen, this.bodies[i])
      }
    },

    addBody: function(body){
      this.bodies.push(body);
    },

    createInvaders: function(numOfInvaders, gameSize){
      var Invaders = [];
      for(var i = 0; i < numOfInvaders; i++){
        var x = 30 + (i%8) * 30
        console.log(x)
        var y = 30 + (i%3) * 30
        Invaders.push(new Invader(this, gameSize, {x: x, y: y}))
      }
      return Invaders
    }

  };

  var Player = function(game, gameSize){
    this.game = game;
    this.size = {x: 15, y:15};
    this.center = {x: gameSize.x / 2, y: gameSize.y - this.size.x };
    this.keyboarder = new Keyboarder();

  };

  Player.prototype = {
    update: function(){
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)){
        this.center.x = this.center.x - 2
      }
      else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)){
        this.center.x = this.center.x + 2
      }

      else if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)){
        var bullet = new Bullet({x: this.center.x, y: this.center.y - this.size.x / 2},
        {x: 0, y: -6})
        this.game.addBody(bullet);
      }
    }
  };

  var Bullet = function(center, velocity){
    this.size = {x: 1, y:1};
    this.center = center;
    this.velocity = velocity;
  };

  Bullet.prototype = {
    update: function(){
      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

    }
  };

  var Invader = function(game, gameSize , center){
    this.size = {x: 15, y:15};
    this.velocity = 0.3;
    this.center = center;
    this.PatrolX = 0;
  }

  Invader.prototype = {
    update: function(){
      if(this.PatrolX < 0 || this.PatrolX >40) {
        this.velocity = -this.velocity
      }
      this.center.x += this.velocity;
      this.PatrolX += this.velocity;
      //console.log(this.center.x)
    }
  }


  var drawRect = function(screen, body){
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
  }

  var Keyboarder = function() {
    var KeyState = {};
    window.onkeydown = function(e) {
      KeyState[e.keyCode] = true;
      console.log(e.keyCode)
    }

    window.onkeyup = function(e) {
      KeyState[e.keyCode] = false;
      console.log(e.keyCode)
    }

    this.isDown = function(keyCode) {
      return KeyState[keyCode] === true;
    }
    this.KEYS = {LEFT: 37, RIGHT: 39, SPACE: 32};
  }

  var colliding = function(b1,b2){
    return !(b1 === b2 ||
    b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2||
    b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2||
    b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2||
    b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2

  );
  }

  window.onload = function() {
    new Game("screen");
  };

})();
