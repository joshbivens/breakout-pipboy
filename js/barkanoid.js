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

var defaultText = {
  font: "20px Oswald",
  align: "left",
  fill: "#FFF"
};

var boldText = {
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
