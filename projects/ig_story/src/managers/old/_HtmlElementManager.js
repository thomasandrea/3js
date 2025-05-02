import * as THREE from "three";
import gsap from "gsap";

export default class HtmlElementManager {
  constructor(camera) {
    this.camera = camera;
  }

  updateBackgroundWithFade(id, min ,max) {
    const bg = document.querySelector(id);
    const maxDistance = min; // Punto di inizio transizione
    const minDistance = max; // Punto di fine transizione
    const currentZ = this.camera.position.z;

    // Calcola una progressione smooth con picco al centro
    const t = THREE.MathUtils.clamp(
      (currentZ - maxDistance) / (minDistance - maxDistance),
      0,
      1
    );

    // Curva a campana (bell curve) per dissolvenza in+out
    const smoothOpacity = Math.pow(Math.sin(t * Math.PI), 0.4);

    // Scala con effetto più pronunciato al centro
    const scale = 1 + smoothOpacity * 0.3; // Scala da 1 a 1.3 e ritorno

    // Debug (opzionale)
    //console.log(`Z: ${currentZ.toFixed(2)} | Opacity: ${smoothOpacity.toFixed(2)} | Scale: ${scale.toFixed(2)}`);

    // Animazione con GSAP
    gsap.to(bg, {
      opacity: smoothOpacity,
      scale: scale,
      duration: 0.5,
      //ease: "sine.inOut" // Easing per fluidità
    });
  }





  /* text */
  updateFirsSceneText() {
    const bg = document.querySelector("#firstSceneText");
    // Calcola l'opacità e la scala in base alla posizione della camera
    const maxDistance = -0.9; // Inizio della transizione
    const minDistance = 0; // Fine della transizione
    const normalizedPosition = THREE.MathUtils.clamp(
      (this.camera.position.z - maxDistance) / (minDistance - maxDistance),
      0,
      1
    );
    const opacity = normalizedPosition; // Lineare da 0 a 1
    const scale = 1 + normalizedPosition * 0.2; // Scala cresce fino a 1.2

    // Applica le modifiche con GSAP
    gsap.to(bg, {
      opacity: opacity,
      // duration: 0.5
    });
  }

  updateSecondSceneText() {
    const bg = document.querySelector("#secondSceneText");
    // Calcola l'opacità e la scala in base alla posizione della camera

    const minDistance = -3; // Fine della transizione
    const maxDistance = 0; // Inizio della transizione

    const normalizedPosition = THREE.MathUtils.clamp(
      (this.camera.position.z - maxDistance) / (minDistance - maxDistance),
      0,
      1
    );

    //console.log(this.camera.position.z)
    const opacity = normalizedPosition; // Lineare da 0 a 1
    const scale = 1 + normalizedPosition * 0.2; // Scala cresce fino a 1.2

    // Applica le modifiche con GSAP
    gsap.to(bg, {
      opacity: opacity,
      //duration: 0.5
    });
  }

  update() {


    this.updateBackgroundWithFade('#bgSecondScene', -5, -36)
    this.updateBackgroundWithFade('#bgThirdScene', -46, -126)
    this.updateBackgroundWithFade('#bgFourthScene', -130, -166)
    //this.updateBackgroundWithFade();

    this.updateFirsSceneText();
    this.updateSecondSceneText();
  }
}
