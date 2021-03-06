
var game = new Phaser.Game(
  800, 600,
  Phaser.AUTO,
  "game",
  { // These three function complete the game
    preload: phaserPreload,
    create: phaserCreate,
    update: phaserUpdate
  }
);

WebFontConfig = {
  active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
  google: {
    families: ['Oswald']
  }
};

var ball, paddle, tiles, livesText, introText, pauseIcon, resumeText, background;

var ballOnPaddle = true;
var lives = 3;
var score = 0;

var textDefault = {
  font: "20px Oswald",
  align: "left",
  fill: "#00FF00"
};

var textLarge = {
  font: "40px Oswald",
  align: "center",
  fill: "#00FF00"
};

var textPause = {
  font: "40px Oswald",
  fill: "#00FF00"
};

function phaserPreload() {
  game.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");

  game.load.audio("collide", "fo4_assets/sfx/collide.wav");
  game.load.audio("death", "fo4_assets/sfx/death.wav");
  game.load.audio("gameover", "fo4_assets/sfx/gameover.wav");

  game.load.image("background", "fo4_assets/images/background.jpg");
  game.load.image("tile0", "fo4_assets/images/tile0.png");
  game.load.image("tile1", "fo4_assets/images/tile1.png");
  game.load.image("tile2", "fo4_assets/images/tile2.png");
  game.load.image("paddle", "fo4_assets/images/paddle.png");
  game.load.image("ball", "fo4_assets/images/ball.png");
  game.load.image("pause", "fo4_assets/images/pause.png")
  game.load.image("restart", "fo4_assets/images/restart.png");
}

function phaserCreate() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.checkCollision.down = false;

  background = game.add.tileSprite(0, 0, 800, 600, "background");

  tiles = game.add.group(); // Groups are display objects. 'Display objects are any obejcts that can be rendered in the Phaser/pixi.js scene graph.'
  tiles.enableBody = true; // This allows the group to be subject to physics - I think.
  tiles.physicsBodyType = Phaser.Physics.ARCADE;

  for(var y = 0; y < 4; y++) { // Rows
    for(var x = 0; x < 15; x++) { // Columns
      var tileRandom = Math.floor(Math.random() * 3);
      var tile = tiles.create(120 + (x * 36), 100 + (y * 52), "tile" + tileRandom); // We'll see what this does.
      // --VVV-- 'bounce' and 'immovable' are features of the ARCADE physics --VVV--
      tile.body.bounce.set(1); // 1 is full rebound; 0.5 would be 50%.
      tile.body.immovable = true;
    }
  }

  collide = game.add.audio("collide");
  death = game.add.audio("death");
  gameover = game.add.audio("gameover");

  paddle = game.add.sprite(game.world.centerX, 480, "paddle");
  paddle.anchor.setTo(0.5, 0.5);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  paddle.body.collideWorldBounds = true;
  paddle.body.bounce.set(1);
  paddle.body.immovable = true;

  ball = game.add.sprite(game.world.centerX, paddle.y - 16, "ball");
  ball.anchor.set(0.3);
  ball.checkWorldBounds = true;
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  ball.events.onOutOfBounds.add(helpers.death, this);

  pauseIcon = game.add.sprite(420, 550, "pause");
  pauseIcon.inputEnabled = true;
  pauseIcon.events.onInputUp.add(helpers.pause, this);
  game.input.onDown.add(helpers.unpause, this);

  restartIcon = game.add.sprite(360, 546, "restart");
  restartIcon.inputEnabled = true;
  restartIcon.events.onInputUp.add(helpers.restart, this);

  game.input.onDown.add(helpers.release, this);
}

function createText() {
  scoreText = game.add.text(32, 550, "score: 0", textDefault);
  livesText = game.add.text(700, 550, "lives: 3", textDefault);
  introText = game.add.text(game.world.centerX, 400, "Click to start", textLarge);
  introText.anchor.setTo(0.5, 0.5);
}

function phaserUpdate() {
  paddle.x = game.input.x;

  if(paddle.x < 24) {
    paddle.x = 24;
  } else if (paddle.x > game.width - 24) {
    paddle.x = game.width - 24;
  }

  if(ballOnPaddle) { // Which is initially set to true
    ball.body.x = paddle.x;
  } else {
    game.physics.arcade.collide(ball, paddle, helpers.ballCollideWithPaddle, null, this);
    game.physics.arcade.collide(ball, tiles, helpers.ballCollideWithTile, null, this);
  }
}

// Helpers
var helpers = {
  release: function() {
    if(ballOnPaddle) {
      ballOnPaddle = false;
      ball.body.velocity.y = -300;
      ball.body.velocity.x = -75;
      introText.visible = false;
    }
  },

  death: function() {
    death.play();
    lives--;
    livesText.text = "lives: " + lives;

    if(lives === 0) {
      helpers.gameOver();
    } else {
      ballOnPaddle = true;
      ball.reset(paddle.body.x + 16, paddle.y - 16);
    }
  },

  gameOver: function() {
    death.stop();
    gameover.play();
    ball.body.velocity.setTo(0, 0);
    introText.text = "Game Over!\nClick below to restart";
    introText.visible = true;
  },

  restart: function() {
    ballOnPaddle = true;
    lives = 3;
    score = 0;
    phaserCreate();
    createText();
  },

  pause: function() {
    if(lives != 0) {
      game.paused = true;
      resumeText = game.add.text(200, 400, "Click anywhere to resume", textPause);
    }
  },

  unpause: function() {
    if(game.paused) {
      game.paused = false;
      resumeText.destroy();
    }
  },

  ballCollideWithTile: function(ball, tile) {
    collide.play();
    tile.kill();
    score += 10;
    scoreText.text = "score: " + score;

    if(tiles.countLiving() <= 0) { //countLiving is a Phaser method
      score += 1000;
      scoreText.text = "score: " + score;
      introText.text = "Next Level";

      ballOnPaddle = true;
      ball.body.velocity.set(0);
      ball.x = paddle.y + 16;
      ball.y = paddle.y - 16;

      tiles.callAll("revive"); // Another Phaser method
    }
  },

  ballCollideWithPaddle: function(ball, tile) {
    var diff = 0;

    if(ball.x < paddle.x) {
      diff = paddle.x - ball.x;
      ball.body.velocity.x = (-10 * diff);
    } else if (ball.x > paddle.x) {
      diff = ball.x -paddle.x;
      ball.body.velocity.x = (10 * diff);
    } else {
      ball.body.velocity.x = 2 + Math.random() * 8;
    }
  }
};
