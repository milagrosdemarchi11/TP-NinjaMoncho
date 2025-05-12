export default class gameover extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  init(data) {
    this.ganaste = data.ganaste;
    this.puntos = data.puntos;
  }

  preload() {
    this.load.image("fondoFinal", "./public/assets/Cielo.webp");
  }

  create() {
    // Fondo
    this.add.image(400, 300, "fondoFinal").setScale(2);

    // Mensaje (Victoria o Derrota)
    const mensaje = this.ganaste ? "¡GANASTE!" : "¡PERDISTE!";
    const color = this.ganaste ? "#0f0" : "#f00"; // Color verde si ganó, rojo si perdió

    // Mostrar el mensaje
    this.add.text(260, 200, mensaje, {
      fontSize: "48px",
      fill: color,
    });

    // puntuación final
    this.add.text(181, 270, "Puntuación final: " + this.puntos, {
      fontSize: "32px",
      fill: "#fff",
    });

    // reiniciar el juego
    this.add.text(170, 350, "Presiona R para volver a jugar", {
      fontSize: "24px",
      fill: "#fff",
    });

    // presionar la tecla R para reiniciar
    this.input.keyboard.once("keydown-R", () => {
      this.scene.start("Game"); // Reinicia la escena "Game" (puedes cambiar el nombre si es otro)
    });
  }
}
