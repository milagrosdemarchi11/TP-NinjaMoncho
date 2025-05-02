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
   // Fondo del juego: imagen del cielo escalada al doble de tamaño
   this.add.image(400, 300, "cielo").setScale(2);
 
   // Grupo de plataformas estáticas
   this.platforms = this.physics.add.staticGroup();
 
   // Crear una plataforma en la parte inferior de la pantalla, escalada al doble
   this.platforms.create(400, 568, "plataforma").setScale(2).refreshBody();
 
   // Crear al jugador con físicas, usando una sola imagen (no un sprite sheet)
   this.player = this.physics.add.sprite(100, 450, "ninja");
 
   // Hacerlo más pequeño (porque la imagen es grande)
   this.player.setScale(0.2);
 
   // Hace que rebote un poco al caer
   this.player.setBounce(0.5);
 
   // Evita que el personaje salga fuera del mundo del juego
   this.player.setCollideWorldBounds(true);
 
   // Detectar colisiones entre el jugador y las plataformas
   this.physics.add.collider(this.player, this.platforms);
 
   // Guardar las teclas de flechas para usarlas en update()
   this.cursors = this.input.keyboard.createCursorKeys();
 
     // Lista de formas
  const formas = ["cuadrado", "triangulo", "diamante"];

  // Función para lanzar una forma con aleatoriedad
  const lanzarForma = (nombreForma) => {
    const x = Phaser.Math.Between(50, 750); // posición X aleatoria
    const y = Phaser.Math.Between(0, 50);   // altura inicial
    const forma = this.physics.add.image(x, y, nombreForma).setScale(0.4);
    forma.setBounce(0.2);
    forma.setCollideWorldBounds(true);
    this.physics.add.collider(forma, this.platforms);
  };

  // Lanzar cada forma en un tiempo aleatorio entre 0.5s y 2.5s
  formas.forEach((nombre) => {
    const delay = Phaser.Math.Between(500, 2500); // entre 0.5s y 2.5s
    this.time.delayedCall(delay, () => {
      lanzarForma(nombre);
    });
  });
  
  this.timeLeft = 30; // Empezamos con 30 segundos
  this.timerText = this.add.text(550, 50, `Tiempo: ${this.timeLeft}`, {
    fontSize: '32px', //tamaño de la fuente
    fill: '#000' //color de la fuente
  });
}

update() {
    // update game objects
     // Movimiento hacia la izquierda
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160); // mover a la izquierda
    this.player.angle -= 5; // girar en sentido antihorario
  }

  // Movimiento hacia la derecha
  else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160); // mover a la derecha
    this.player.angle += 5; // girar en sentido horario
  }

  // Si no se presiona izquierda ni derecha
  else {
    this.player.setVelocityX(0); // detener movimiento horizontal

    // Si el personaje está tocando el suelo, reiniciar el ángulo (dejarlo derecho)
    if (this.player.body.touching.down) {
      this.player.angle = 0;
    }
  }

  // Salto: si se presiona la flecha arriba y el jugador está en el suelo
  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-330); // saltar hacia arriba
  }
}
}
