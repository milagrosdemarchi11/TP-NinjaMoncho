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
    this.load.image("cielo", "./public/assets/Cielo.webp");
    this.load.image("diamante","./public/assets/diamond.png");
    this.load.image("ninja","./public/assets/Ninja.png");
    this.load.image("plataforma","./public/assets/platform.png");
    this.load.image("cuadrado","./public/assets/square.png");
    this.load.image("triangulo","./public/assets/triangle.png");
  }

  create() {
      // Fondo y plataformas
      this.add.image(400, 300, "cielo").setScale(2);
      this.platforms = this.physics.add.staticGroup();
      this.platforms.create(400, 568, "plataforma").setScale(2).refreshBody();
  
      // Jugador
      this.player = this.physics.add.sprite(400, 300, "ninja").setScale(0.2);
      this.player.setBounce(0.5);
      this.player.setCollideWorldBounds(true);
      this.physics.add.collider(this.player, this.platforms);
      this.cursors = this.input.keyboard.createCursorKeys();
  
      // Puntaje y tiempo
      this.figRecolectadas = [];
      this.puntos = 0;
      this.puntosTexto = this.add.text(16, 16, "Puntos: 0", {
        fontSize: "20px",
        fill: "#fff",
      });
  
      this.timeLeft = 30;
      this.timerText = this.add.text(650, 16, "Tiempo: " + this.timeLeft, {
        fontSize: "20px",
        fill: "#fff",
      });
  
      // Evento de caída de figuras
      this.time.addEvent({
        delay: 1500,
        callback: () => {
          const tipos = ["cuadrado", "triangulo", "diamante"];
          const tipo = Phaser.Utils.Array.GetRandom(tipos);
          const x = Phaser.Math.Between(50, 750);
          const figura = this.physics.add.image(x, 0, tipo).setScale(0.4);
          figura.tipo = tipo;
          figura.setVelocityY(Phaser.Math.Between(80, 150));
  
          // Colisión con plataformas (opcional si querés que reboten)
          this.physics.add.collider(figura, this.platforms);
  
          // Colisión con el jugador
          this.physics.add.overlap(this.player, figura, () => {
            figura.destroy();
  
            this.figRecolectadas.push(tipo);
  
            let puntosGanados = 0;
            if (tipo === "cuadrado") {
              puntosGanados = 2;
            } else if (tipo === "triangulo") {
              puntosGanados = 4;
            } else if (tipo === "diamante") {
              puntosGanados = 8;
            }
  
            this.puntos += puntosGanados;
            this.puntosTexto.setText("Puntos: " + this.puntos);
  
            const cuadrados = this.figRecolectadas.filter(f => f === "cuadrado").length;
            const triangulos = this.figRecolectadas.filter(f => f === "triangulo").length;
            const diamantes = this.figRecolectadas.filter(f => f === "diamante").length;
  
            if (cuadrados >= 2 && triangulos >= 2 && diamantes >= 2) {
              this.add.text(300, 300, "¡GANASTE!", {
                fontSize: "40px",
                fill: "#0f0",
              });
              this.scene.pause();
            }
          });
        },
        loop: true,
      });
  
      // Temporizador de 30 segundos
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.timeLeft--;
          this.timerText.setText("Tiempo: " + this.timeLeft);
  
          if (this.timeLeft <= 0) {
            this.player.setTint(0xff0000);
            this.add.text(300, 300, "¡PERDISTE!", {
              fontSize: "40px",
              fill: "#f00",
            });
            this.scene.pause();
          }
        },
        loop: true,
      });
}

update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-300);
    this.player.angle -= 5;
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(300);
    this.player.angle += 5;
  } else {
    this.player.setVelocityX(0);
    if (this.player.body && this.player.body.blocked.down) {
      this.player.angle = 0;
    }
  }

  if (this.cursors.up.isDown && this.player.body && this.player.body.blocked.down) {
    this.player.setVelocityY(-330);
  }
}
}

  





