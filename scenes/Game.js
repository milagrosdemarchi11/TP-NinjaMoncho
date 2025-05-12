// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("Game");
  }

  init() { 
  }

    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
   
   
   
  
  preload() {
    // Cargar los recursos
    this.load.image("cielo", "./public/assets/Cielo.webp");
    this.load.image("diamante", "./public/assets/diamond.png");
    this.load.image("ninja", "./public/assets/Ninja.png");
    this.load.image("plataforma", "./public/assets/platform.png");
    this.load.image("cuadrado", "./public/assets/square.png");
    this.load.image("triangulo", "./public/assets/triangle.png");
    this.load.image("enemigo", "./public/assets/enemigo.png");
   
  }

  create() {
    // Fondo
    this.add.image(400, 300, "cielo").setScale(2);

    // Plataformas estáticas
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(800, 200, "plataforma");
    this.platforms.create(115, 420, "plataforma");

    // Suelo
    this.suelo = this.physics.add.staticGroup();
    this.suelo.create(400, 600, "plataforma").setScale(2).refreshBody();

    // Jugador
    this.player = this.physics.add.sprite(400, 500, "ninja").setScale(0.1);
    this.player.setBounce(0.7);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.suelo);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

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

    // Grupo de enemigos y figuras
    this.enemigos = this.physics.add.group();
    this.figuras = this.physics.add.group();

    // Temporizador de enemigos
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        const x = Phaser.Math.Between(50, 750);
        const enemigo = this.enemigos.create(x, 0, "enemigo").setScale(0.4);
        enemigo.setVelocityY(Phaser.Math.Between(100, 180));
        enemigo.setBounce(Phaser.Math.FloatBetween(0.3, 0.6));
        enemigo.setCollideWorldBounds(false);

        this.physics.add.collider(enemigo, this.platforms);
        this.physics.add.collider(enemigo, this.suelo);
        this.physics.add.overlap(this.player, enemigo, () => {
          if (!enemigo.active) return;
          enemigo.destroy();
          this.puntos = Math.max(0, this.puntos - 10);
          this.puntosTexto.setText("Puntos: " + this.puntos);
        });
      },
      loop: true,
    });

    // Temporizador de figuras
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const tipos = ["cuadrado", "triangulo", "diamante"];
        const tipo = Phaser.Math.RND.pick(tipos);
        const x = Phaser.Math.Between(50, 750);
        const figura = this.figuras.create(x, 0, tipo).setScale(0.4);

        figura.tipo = tipo;
        figura.valor = tipo === "cuadrado" ? 20 : tipo === "triangulo" ? 25 : 15;
        figura.setVelocityY(Phaser.Math.Between(80, 150));
        figura.setBounce(Phaser.Math.FloatBetween(0.2, 0.9));
        figura.setCollideWorldBounds(false);

        this.physics.add.collider(figura, this.platforms, () => {
          if (figura.active) this.reducirValor(figura);
        });

        this.physics.add.collider(figura, this.suelo, () => {
          if (figura.active) this.reducirValor(figura);
        });

        this.physics.add.overlap(this.player, figura, () => {
          if (figura.active) this.recolectarFigura(figura);
        });
      },
      loop: true,
    });

    // Temporizador principal
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText("Tiempo: " + this.timeLeft);
        if (this.timeLeft <= 0) {
          this.player.setTint(0xff0000);
          this.scene.start("GameOver", {
            resultado: false,
            puntos: this.puntos,
          });
        }
      },
      loop: true,
    });

    // Destruir objetos que caen fuera del mundo
    this.physics.world.on("worldbounds", (body) => {
      if (body.gameObject) {
        body.gameObject.destroy();
      }
    });
  }

  reducirValor(figura) {
    if (figura.valor > 0) {
      figura.valor -= 5;
    }
  }

  recolectarFigura(figura) {
    const puntosGanados = figura.valor > 0 ? figura.valor : 0;
    this.puntos += puntosGanados;
    this.figRecolectadas.push(figura.tipo);
    figura.destroy();

    this.puntosTexto.setText("Puntos: " + this.puntos);

    const cuadrados = this.figRecolectadas.filter((f) => f === "cuadrado").length;
    const triangulos = this.figRecolectadas.filter((f) => f === "triangulo").length;
    const diamantes = this.figRecolectadas.filter((f) => f === "diamante").length;

      if (this.puntos >= 100) {
        this.scene.start("GameOver", {
          ganaste: true,
          puntos: this.puntos,
        });
        }
            //if (cuadrados >= 2 && triangulos >= 2 && diamantes >= 2) {
    //  this.scene.start("gameover", {
       // resultado: "ganaste",
      //  puntos: this.puntos,
      //}); esto no hacer
  }
  

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-250);
      this.player.angle -= 5;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(250);
      this.player.angle += 5;
    } else {
      this.player.setVelocityX(0);
      if (this.player.body.blocked.down) {
        this.player.angle = 0;
      }
    }

    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-400);
    }

    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }
  }
}




  