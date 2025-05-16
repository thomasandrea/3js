import * as THREE from "three";
import gsap from "gsap";

export default class HtmlElementManager {
  constructor(camera) {
    this.camera = camera;
    this.elements = []; // Array per memorizzare tutti gli elementi da gestire
  }
  /**
   * Aggiunge un elemento da gestire con effetto fade
   * @param {string} id - Selettore dell'elemento
   * @param {number} startZ - Posizione Z di inizio effetto
   * @param {number} endZ - Posizione Z di fine effetto
   * @param {Object} options - Opzioni aggiuntive (opzionale)
   */
  addFadeElement(id, startZ, endZ, options = {}) {
    const defaultOptions = {
      type: "fade",
      maxScale: 1.3,
      duration: 0.5,
      ease: "power1.out",
      power: 0.4,
      visible: true,
    };

    this.elements.push({
      id: id,
      startZ: startZ,
      endZ: endZ,
      ...defaultOptions,
      ...options,
    });

    return this; // Per consentire il concatenamento
  }

  /**
   * Aggiunge un elemento di testo da gestire
   * @param {string} id - Selettore dell'elemento
   * @param {number} startZ - Posizione Z di inizio effetto
   * @param {number} endZ - Posizione Z di fine effetto
   * @param {Object} options - Opzioni aggiuntive (opzionale)
   */
  addTextElement(id, startZ, endZ, options = {}) {
    const defaultOptions = {
      type: "text",
      maxScale: 1.2,
      duration: 0.5,
      power: 0.4,
      ease: "power1.out",
      visible: true,
      scaleEnabled: false,
    };

    this.elements.push({
      id: id,
      startZ: startZ,
      endZ: endZ,
      ...defaultOptions,
      ...options,
    });

    return this; // Per consentire il concatenamento
  }

  addShiftElement(id, startZ, endZ, options = {}) {
    const defaultOptions = {
      type: "shift",
      direction: "left", // 'left' o 'right'
      maxShift: 100, // pixels di spostamento
      duration: 0,
      //ease: "power1.out",
      ease: "none",
      power: 0.4,
      visible: true,
    };

    this.elements.push({
      id: id,
      startZ: startZ,
      endZ: endZ,
      ...defaultOptions,
      ...options,
    });

    return this; // Per consentire il concatenamento
  }

  /**
   * Aggiunge elementi multipli con le stesse opzioni di base
   * @param {Array} elementsConfig - Array di configurazioni: [{id, startZ, endZ, options}]
   * @param {string} type - Il tipo di elementi ('fade' o 'text')
   */
  addMultipleElements(elementsConfig, type = "fade") {
    elementsConfig.forEach((config) => {
      if (type === "fade") {
        this.addFadeElement(
          config.id,
          config.startZ,
          config.endZ,
          config.options
        );
      } else if (type === "text") {
        this.addTextElement(
          config.id,
          config.startZ,
          config.endZ,
          config.options
        );
      } else if (config.type === "shift") {
        this.applyShiftEffect(el, t, config);
      }
    });
    return this;
  }

  /**
   * Calcola il valore normalizzato per la transizione in base alla posizione della camera
   */
  getNormalizedValue(startZ, endZ) {
    const currentZ = this.camera.position.z;
    return THREE.MathUtils.clamp((currentZ - startZ) / (endZ - startZ), 0, 1);
  }

  /**
   * Applica l'effetto di dissolvenza con una curva a campana
   */
  applyFadeEffect(element, t, options) {
    // Curva a campana (bell curve) per dissolvenza in+out
    //const smoothOpacity = Math.pow(Math.sin(t * Math.PI), options.power);

    // Scala con effetto più pronunciato al centro
    //const scale = 1 + smoothOpacity * (options.maxScale - 1);
    const smoothOpacity = Math.pow(Math.sin(t * Math.PI), options.power);

    // Scala cresce in entrata e in uscita, minima al centro
    //const edgeFactor = Math.pow(Math.abs(2 * t - 1), options.power); // curva a U
    //const scale = 1 + edgeFactor * (options.maxScale - 1);

    // Scala cresce progressivamente da 1 a maxScale
    const scaleProgress = Math.pow(t, options.scalePower || 1); // puoi regolare 'scalePower'
    const scale = 1 + scaleProgress * (options.maxScale - 1);

    gsap.to(element, {
      opacity: smoothOpacity,
      scale: scale,
      duration: options.duration,
      ease: options.ease,
    });
  }

  /**
   * Applica l'effetto di transizione per il testo
   */
  applyTextEffect(element, t, options) {
    // Curva a campana (bell curve) per dissolvenza in+out
    const smoothOpacity = Math.pow(Math.sin(t * Math.PI), options.power);

    // Scala con effetto più pronunciato al centro
    const scale = 1 + smoothOpacity * (options.maxScale - 1);
    gsap.to(element, {
      opacity: smoothOpacity,
      //scale: scale,
      duration: options.duration,
      ease: options.ease,
    });
  }

  /**
   * Applica l'effetto di spostamento orizzontale
   */
  applyShiftEffect(element, t, options) {
    // Calcola lo spostamento basato sulla curva a campana
    //const smoothProgress = Math.pow(Math.sin(t * Math.PI), options.power);
    
    // Determina la direzione dello spostamento
    const shiftMultiplier = options.direction === 'right' ? 1 : -1;

    //const shiftProgress = Math.pow(t,  1); // puoi regolare 'scalePower'


    const shiftProgress =t;
    //const scale = 1 + scaleProgress * (options.maxScale - 1);
    
    // Calcola lo spostamento
    const shift = shiftProgress * options.maxShift * shiftMultiplier;

    gsap.to(element, {
      //x: shift,
      xPercent: shift,
      duration: options.duration,
      ease: options.ease
    });
  }
  /**
   * Metodo principale per aggiornare tutti gli elementi
   */
  update() {
    const currentZ = this.camera.position.z;
    const currentX = this.camera.position.x;

    

    this.elements.forEach((config) => {
      // Cache dell'elemento DOM
      if (!config.element) {
        config.element = document.querySelector(config.id);
      }
      const el = config.element;
      if (!el || !config.visible) return;

      const outOfRange = currentZ > config.startZ + 2 || currentZ < config.endZ - 2;

      // Gestione display senza calcoli o animazioni


      if (outOfRange && config.type!=="shift") {
        if (el.style.display !== "none") {
          el.style.display = "none";
        }
        return;
      } else {
        if (el.style.display === "none") {
          el.style.display = "block";
        }
      }

      // Normalized t solo se necessario
      const t = THREE.MathUtils.clamp(
        (currentZ - config.startZ) / (config.endZ - config.startZ),
        0,
        1
      );

      // Effetto
      if (config.type === "fade") {
        this.applyFadeEffect(el, t, config);
      } else if (config.type === "text") {
        this.applyTextEffect(el, t, config);
      } else if (config.type === "shift") {
        const t = THREE.MathUtils.clamp(
          (currentX - config.startZ) / (config.endZ - config.startZ),
          0,
          1
        );

        this.applyShiftEffect(el, t, config);
      }

      // Callback opzionale
      if (typeof config.onUpdate === "function") {
        config.onUpdate(el, t, this.camera);
      }
    });
  }

  /**
   * Mostra o nasconde un elemento specifico
   */
  toggleElement(id, visible) {
    const element = this.elements.find((el) => el.id === id);
    if (element) {
      element.visible = visible;
    }
    return this;
  }

  /**
   * Aggiorna le proprietà di un elemento esistente
   */
  updateElementConfig(id, newConfig) {
    const index = this.elements.findIndex((el) => el.id === id);
    if (index !== -1) {
      this.elements[index] = { ...this.elements[index], ...newConfig };
    }
    return this;
  }

  /**
   * Rimuove un elemento dalla gestione
   */
  removeElement(id) {
    this.elements = this.elements.filter((el) => el.id !== id);
    return this;
  }
}
