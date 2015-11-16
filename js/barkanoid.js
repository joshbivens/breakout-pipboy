var game = new Phaser.Game(
  800, 600,
  Phaser.AUTO,
  "game",
  {
    preload: phaserPreload,
    create: phaserCreate,
    update: phaserUpdate
  }
);

var ball, paddle, tiles, livesText, introText, background;

var ballOnPaddle = true;
var lives = 3;
var score = 0;

var textDefault = {
  font: "20px Oswald",
  align: "left",
  fill: "#FFF"
};

var textLarge = {
  font: "40px Oswald",
  align: "center",
  fill: "#FFF"
};

function phaserPreload() {
  game.load.image("background", "/assets/background.jpg");
  game.load.image("tile0", "/assets/tile0.png");
  game.load.image("tile1", "/assets/tile1.png");
  game.load.image("tile2", "/assets/tile2.png");
  game.load.image("tile3", "/assets/tile3.png");
  game.load.image("tile4", "/assets/tile4.png");
  game.load.image("tile5", "/assets/tile5.png");
  game.load.image("paddle", "/assets/paddle.png");
  game.load.image("ball", "/assets/ball.png");
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
      var tileRandom = Math.floor(Math.random() * 6);
      var tile = tiles.create(120 + (x * 36), 100 + (y * 52), "tile" + tileRandom); // We'll see what this does.
      // --VVV-- 'bounce' and 'immovable' are features of the ARCADE physics --VVV--
      tile.body.bounce.set(1); // 1 is full rebound; 0.5 would be 50%.
      tile.body.immovable = true;
    }
  }

  paddle = game add.sprite(game.world.centerX, 500, "paddle");
  paddle.anchor.setTo(0.5, 0.5); //Pixels?
  game.physics.enabled(paddle, Phaser.Physics.ARCADE);
  paddle.body.collideWorldBounds = true;
  paddle.body.bounce.set(1);
  paddle.body.immovable = true;

  ball = game.add.sprite(game.world.centerX, paddle.y - 16, "ball");
  ball.anchor.set(0.5);
  ball.checkWorldBounds = true;
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  ball.events.onOutOfBounds.add(helpers.death, this);

  scoreText = game.add.text(32, 550, "score: 0", textDefault);
  livesText = game.add.text(680, 550, "lives: 3", textDefault);
  introText = game.add.text(game.world.centerX, 400, "-Click to start-", textLarge);
  introText.anchor.setTo(0.5, 0.5);
  game.input.onDown.add(helpers.release, this);
}
