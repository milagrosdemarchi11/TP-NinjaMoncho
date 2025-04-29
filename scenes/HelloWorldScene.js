// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // load assets
    this.load.image("Cielo", "./assets/Cielo.webp");
    this.load.image("Diamante", "./assets/diamond.png");
    this.load.image("Menu", "./assets/FondoMenu.png");
    this.load.image("ninja","./assets/Ninja.png");
    this.load.image("plataforma","./assets/platform.png");
    this.load.image("cuadrado","./assets/square.png");
    this.loadd.image("triangulo","./assets/triangle.png");
  }

  create() {
    // create game objects
    this.add.image(400, 300, "Cielo");
    this.add.image(15, 10, "Diamante");
    this.add.image(400, 300, "Menu");

    
  }

  update() {
    // update game objects
  }
}
