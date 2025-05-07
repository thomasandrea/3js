import * as THREE from "three";
import gsap from "gsap";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

// Importa le texture
/*import cloud1Texture from "/textures/cloud/cloud-1.png?url";
import cloud2Texture from "/textures/cloud/cloud-2.png?url";
import cloud3Texture from "/textures/cloud/cloud-blur-01.png?url";
import cloud4Texture from "/textures/cloud/cloud-blur-02.png?url";

import mountainTexture from "/textures/landscape/mountain.png?url";
import panelTexture from "/textures/solar/panels.png?url";*/



import cloud1Texture from "/textures-ktx2/cloud/cloud-1.ktx2?url";
import cloud2Texture from "/textures-ktx2/cloud/cloud-2.ktx2?url";
import cloud3Texture from "/textures-ktx2/cloud/cloud-blur-01.ktx2?url";
import cloud4Texture from "/textures-ktx2/cloud/cloud-blur-02.ktx2?url";

import mountainTexture from "/textures-ktx2/landscape/mountain.ktx2?url";
import panelTexture from "/textures-ktx2/solar/panels.ktx2?url";

//import grassTexture from "/textures/landscape/grass.png?url";

export default class PlaneModelManager {
  constructor(scene, renderer) {
    this.scene = scene;
    this.manager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.manager);
    this.planes = [];
    this.planeConfigs = [];
    //this.textureMap = {};
    this.animations = [];
    const baseUrl = process.env.NODE_ENV === 'production' ? '/ig_story/' : '.';
    
    this.ktx2Loader = new KTX2Loader(this.manager)
      .setTranscoderPath(`${baseUrl}/basis/`) // Assicurati che questa sia la path corretta verso i file .wasm/.js di Basis
      .detectSupport(renderer); // Passa il renderer usato nel tuo progetto

    this.textureMap = {
      cloud1: cloud1Texture,
      cloud2: cloud2Texture,
      cloud3: cloud3Texture,
      cloud4: cloud4Texture,
      mountain: mountainTexture,
      panels: panelTexture,
    };
  }

  /**
   * Aggiunge una texture al manager
   * @param {string} key - Chiave per identificare la texture
   * @param {string} url - URL della texture
   */
  addTexture(key, url) {
    this.textureMap[key] = url;
    return this;
  }

  /**
   * Aggiunge più texture contemporaneamente
   * @param {Object} textureMap - Mappa di texture { key: url }
   */
  addTextures(textureMap) {
    this.textureMap = { ...this.textureMap, ...textureMap };
    return this;
  }

  /**
   * Aggiunge una configurazione di piano al manager
   * @param {Object} config - Configurazione del piano
   */
  addPlaneConfig(config) {
    const defaultConfig = {
      textureKey: null, // Quale texture usare dal textureMap
      textureUrl: null, // URL diretto della texture (alternativa a textureKey)
      height: 1.0, // Altezza del piano
      preserveAspect: true, // Mantiene l'aspect ratio dell'immagine
      width: null, // Larghezza specifica (se preserveAspect è false)
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      opacity: 1,
      visible: true,
      tag: null, // Tag opzionale per raggruppare i piani
      material: {
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
        color: 0xffffff, // Tinta da applicare alla texture
      },
      geometry: {
        widthSegments: 1, // Segmenti della geometria
        heightSegments: 1,
      },
      animation: null, // Configurazione dell'animazione (se presente)
      autoAdd: true, // Aggiunge automaticamente alla scena
      visibilityRange: null, // Intervallo di visibilità basato sulla camera { startZ, endZ }
      renderOrder: 0, // Ordine di rendering
    };

    // Unisci la configurazione di default con quella fornita
    const mergedConfig = { ...defaultConfig, ...config };

    // Salva la configurazione
    this.planeConfigs.push(mergedConfig);

    return this;
  }

  /**
   * Carica tutti i piani configurati
   * @param {Function} onAllReady - Callback da eseguire quando tutti i piani sono pronti
   */
  loadAllPlanes(onAllReady) {
    let loadedCount = 0;
    const totalPlanes = this.planeConfigs.length;

    // Se non ci sono piani da caricare, esegui subito il callback
    if (totalPlanes === 0 && onAllReady) {
      onAllReady(this.planes);
      return;
    }

    // Carica ogni piano in base alla configurazione
    this.planeConfigs.forEach((config, index) => {
      this.loadPlane(config, (plane) => {
        this.planes.push(plane);
        loadedCount++;

        // Se tutti i piani sono stati caricati, esegui il callback
        if (loadedCount === totalPlanes && onAllReady) {
          onAllReady(this.planes);
        }
      });
    });

    return this;
  }

  /**
   * Carica un singolo piano in base alla configurazione
   * @param {Object} config - Configurazione del piano
   * @param {Function} onReady - Callback da eseguire quando il piano è pronto
   */
  loadPlane(config, onReady) {
    // Determina l'URL della texture
    let textureUrl = null;

    //const loader = textureUrl.endsWith('.ktx2') ? this.ktx2Loader : this.textureLoader;
    //loader.load(textureUrl, (texture) => {



    if (config.textureKey && this.textureMap[config.textureKey]) {
      textureUrl = this.textureMap[config.textureKey];
    } else if (config.textureUrl) {
      textureUrl = config.textureUrl;
    }

    // Se non c'è texture, crea un piano colorato
    if (!textureUrl) {
      this.createColoredPlane(config, onReady);
      return;
    }

    const loader = textureUrl.endsWith('.ktx2') ? this.ktx2Loader : this.textureLoader;
    loader.load(textureUrl, (texture) => {
      console.log(texture.image.width, texture.image.height , texture.image.name);
    //this.textureLoader.load(textureUrl, (texture) => {
      // Calcola le dimensioni in base all'aspect ratio dell'immagine

      let width, height;
      
     

      height = config.height;

      if (config.preserveAspect && texture.image) {
        const imageAspect = texture.image.width / texture.image.height;
        width = height * imageAspect;
      } else {
        width = config.width || height;
      }

      // Crea geometria e materiale
      const geometry = new THREE.PlaneGeometry(
        width,
        height,
        config.geometry.widthSegments,
        config.geometry.heightSegments
      );

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        ...config.material,
        opacity: config.opacity,
      });

      // Crea mesh
      const plane = new THREE.Mesh(geometry, material);

      this.setupPlane(plane, config, onReady);
    });
  }

  /**
   * Crea un piano colorato senza texture
   */
  createColoredPlane(config, onReady) {
    const width = config.width || config.height;
    const height = config.height;

    const geometry = new THREE.PlaneGeometry(
      width,
      height,
      config.geometry.widthSegments,
      config.geometry.heightSegments
    );

    const material = new THREE.MeshBasicMaterial({
      color: config.material.color,
      ...config.material,
      opacity: config.opacity,
    });

    const plane = new THREE.Mesh(geometry, material);

    this.setupPlane(plane, config, onReady);
  }

  /**
   * Configura un piano dopo la creazione
   */
  setupPlane(plane, config, onReady) {
    // Imposta posizione, rotazione e scala
    plane.position.set(config.position.x, config.position.y, config.position.z);

    plane.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);

    plane.scale.set(config.scale.x, config.scale.y, config.scale.z);

    plane.visible = config.visible;
    plane.renderOrder = config.renderOrder;

    // Aggiungi metadati al piano per riferimento futuro
    plane.userData = {
      config: config,
      initialPosition: { ...config.position },
      initialOpacity: config.opacity,
      tag: config.tag,
    };

    // Aggiungi alla scena se richiesto
    if (config.autoAdd && this.scene) {
      this.scene.add(plane);
    }

    // Configura animazione se specificata
    if (config.animation) {
      this.setupAnimation(plane, config.animation);
    }

    // Esegui callback
    if (onReady) onReady(plane);
  }

  /**
   * Configura un'animazione per un piano
   * @param {THREE.Mesh} plane - Il piano da animare
   * @param {Object} animConfig - Configurazione dell'animazione
   */
  setupAnimation(plane, animConfig) {
    if (!animConfig) return;

    const defaultAnimConfig = {
      type: "circular", // circular, float, pulse, rotate, etc.
      duration: 10,
      repeat: -1,
      yoyo: false,
      ease: "none",
    };

    const config = { ...defaultAnimConfig, ...animConfig };
    let animation;

    switch (config.type) {
      case "circular":
        animation = this.createCircularAnimation(plane, config);
        break;
      case "float":
        animation = this.createFloatAnimation(plane, config);
        break;
      case "pulse":
        animation = this.createPulseAnimation(plane, config);
        break;
      case "rotate":
        animation = this.createRotationAnimation(plane, config);
        break;
      case "custom":
        if (typeof config.customAnimation === "function") {
          animation = config.customAnimation(plane, gsap);
        }
        break;
    }

    if (animation) {
      this.animations.push(animation);

      // Memorizza l'animazione nel userData del piano
      if (!plane.userData.animations) plane.userData.animations = [];
      plane.userData.animations.push(animation);
    }

    return animation;
  }

  /**
   * Crea un'animazione circolare per un piano
   */
  createCircularAnimation(plane, config) {
    const center = {
      x: plane.position.x,
      z: plane.position.z,
    };

    const radius = config.radius || 0.1;
    let angle = config.startAngle || 0;

    return gsap.to(
      {},
      {
        duration: config.duration,
        repeat: config.repeat,
        onUpdate: () => {
          angle += config.speed || 0.01;
          plane.position.x = center.x + radius * Math.cos(angle);
          plane.position.z = center.z + radius * Math.sin(angle);
        },
      }
    );
  }

  /**
   * Crea un'animazione fluttuante per un piano
   */
  createFloatAnimation(plane, config) {
    const startY = plane.position.y;

    return gsap.to(plane.position, {
      y: startY + (config.distance || 0.1),
      duration: config.duration,
      repeat: config.repeat,
      yoyo: true,
      ease: config.ease,
    });
  }

  /**
   * Crea un'animazione pulsante per un piano
   */
  createPulseAnimation(plane, config) {
    return gsap.to(plane.material, {
      opacity: config.targetOpacity || plane.material.opacity * 0.5,
      duration: config.duration,
      repeat: config.repeat,
      yoyo: true,
      ease: config.ease,
    });
  }

  /**
   * Crea un'animazione di rotazione per un piano
   */
  createRotationAnimation(plane, config) {
    const axes = config.axes || { x: 0, y: 0, z: 1 };
    const targetRotation = { ...plane.rotation };

    if (axes.x) targetRotation.x += Math.PI * 2;
    if (axes.y) targetRotation.y += Math.PI * 2;
    if (axes.z) targetRotation.z += Math.PI * 2;

    return gsap.to(plane.rotation, {
      ...targetRotation,
      duration: config.duration,
      repeat: config.repeat,
      ease: config.ease,
    });
  }

  /**
   * Aggiorna la visibilità dei piani in base alla posizione della camera
   * @param {THREE.Camera} camera - La camera da usare per il controllo di visibilità
   */

  updateVisibility(camera) {
    if (!camera) return;

    const cameraZ = camera.position.z;
    console.log();
    this.planes.forEach((plane) => {
      const range = plane.userData.config.visibilityRange;

      if (range) {
        // Se abbiamo un intervallo di visibilità definito
        let visible = true;
        let opacity = plane.userData.initialOpacity || 1;

        // Verifica se la camera è fuori dall'intervallo
        if (range.startZ !== undefined && range.endZ !== undefined) {
          // Assicurati che startZ <= endZ (se non lo sono già)
          const minZ = Math.min(range.startZ, range.endZ);
          const maxZ = Math.max(range.startZ, range.endZ);

          // Verifica se cameraZ è dentro il range
          visible = cameraZ >= minZ && cameraZ <= maxZ;

          /*if (cameraZ > range.startZ || cameraZ < range.endZ) {
            console.log(cameraZ, range.startZ,"---> false d", cameraZ < range.startZ )
            visible = false;

          } else {
            // Calcoliamo la sfumatura di opacità se necessario
            /*if (range.fadeIn && cameraZ < range.startZ + range.fadeIn) {
              // Zona di fade in
              const t = (cameraZ - range.startZ) / range.fadeIn;
              opacity *= Math.max(0, Math.min(1, t));
            }
            
            if (range.fadeOut && cameraZ > range.endZ - range.fadeOut) {
              // Zona di fade out
              const t = (range.endZ - cameraZ) / range.fadeOut;
              opacity *= Math.max(0, Math.min(1, t));
            }*/
          //}
        }

        // Imposta visibilità e opacità
        plane.visible = visible && opacity > 0.01;
        plane.material.opacity = opacity;

        // Aggiorna la scala se richiesto
        /*if (range.affectsScale && visible) {
          const scale = range.baseScale || 1;
          const scaleVariation = range.scaleVariation || 0.2;
          const currentScale = scale + scaleVariation * opacity;
          plane.scale.set(currentScale, currentScale, currentScale);
        }*/
      }
    });
  }

  /*
  updateVisibility(camera) {
    this.planes.forEach(plane => {
      const range = plane.userData.config.visibilityRange;
      
      if (range) {
        const t = THREE.MathUtils.clamp(
          (camera.position.z - range.startZ) / (range.endZ - range.startZ),
          0,
          1
        );
        
        // Se specificato, usa una curva di transizione
        let opacity;
        if (range.transitionCurve === 'bell') {
          opacity = Math.pow(Math.sin(t * Math.PI), range.power || 0.4);
        } else {
          opacity = t * plane.userData.initialOpacity;
        }
        
        // Aggiorna opacità
        plane.material.opacity = opacity;
        
        // Opzionalmente aggiorna anche la scala
        if (range.affectsScale) {
          const scale = 1 + opacity * (range.maxScale - 1 || 0.2);
          plane.scale.set(scale, scale, scale);
        }
        
        // Rendi il piano visibile solo se ha una certa opacità
        plane.visible = opacity > 0.01;
      }
    });
  }*/

  /**
   * Aggiorna tutti i piani (da chiamare nel loop di animazione)
   */
  update(camera) {
    if (camera) {
      console.log("-->");
      this.updateVisibility(camera);
    }

    // Qui puoi aggiungere altre logiche di aggiornamento
  }

  /**
   * Ottiene tutti i piani con un determinato tag
   */
  getPlanesByTag(tag) {
    return this.planes.filter((plane) => plane.userData.tag === tag);
  }

  /**
   * Applica una funzione a tutti i piani con un determinato tag
   */
  forEachByTag(tag, callback) {
    const filteredPlanes = this.getPlanesByTag(tag);
    filteredPlanes.forEach(callback);
    return this;
  }

  /**
   * Modifica la visibilità di tutti i piani con un determinato tag
   */
  setVisibleByTag(tag, visible) {
    return this.forEachByTag(tag, (plane) => {
      plane.visible = visible;
    });
  }

  /**
   * Pulisce tutte le risorse
   */
  dispose() {
    // Ferma tutte le animazioni
    this.animations.forEach((anim) => {
      if (anim && anim.kill) anim.kill();
    });

    // Rimuovi i piani dalla scena
    this.planes.forEach((plane) => {
      if (this.scene) this.scene.remove(plane);
      if (plane.geometry) plane.geometry.dispose();
      if (plane.material) {
        if (plane.material.map) plane.material.map.dispose();
        plane.material.dispose();
      }
    });

    this.planes = [];
    this.planeConfigs = [];
    this.animations = [];
  }

  /**
   * Importa configurazioni per nuvole (per compatibilità con il codice originale)
   */
  importCloudConfigs(cloudTextures) {
    // Verifica se sono state fornite le texture
    if (cloudTextures) {
      this.addTextures({
        cloud1: cloudTextures.cloud1,
        cloud2: cloudTextures.cloud2,
        cloud3: cloudTextures.cloud3,
        cloud4: cloudTextures.cloud4,
      });
    }

    this.addPlaneConfig({
      textureKey: "cloud1",
      height: 0.24,
      position: { x: -1, y: 0, z: 0.1 },
      tag: "cloud",
      animation: {
        type: "circular",
        radius: 0.1,
        speed: 0.0035,
        duration: 1000,
        repeat: -1,
      },
    });

    this.addPlaneConfig({
      textureKey: "cloud2",
      height: 0.5,
      position: { x: 1, y: -0.5, z: -0.5 },
      tag: "cloud",
    });

    this.addPlaneConfig({
      textureKey: "cloud3",
      height: 0.7,
      position: { x: -3, y: 0.8, z: -1.5 },
      tag: "cloud",
    });

    this.addPlaneConfig({
      textureKey: "cloud4",
      height: 0.7,
      position: { x: 3, y: -1.4, z: -1.5 },
      tag: "cloud",
    });

    this.addPlaneConfig({
      textureKey: "mountain",
      height: 30,
      position: { x: 30, y: -8, z: -144.5 },
      tag: "mountain",
      visibilityRange: {
        startZ: -123, // Inizia a essere visibile quando la camera è a z=-150
        endZ: -150, // Smette di essere visibile quando la camera supera z=-100
        fadeIn: 10, // Sfuma in entrata nei primi 10 unità
        fadeOut: 15, // Sfuma in uscita negli ultimi 15 unità
        affectsScale: true,
        baseScale: 1,
        scaleVariation: 0.2,
      },
    });

    this.addPlaneConfig({
      textureKey: "panels",
      height: 6,
      position: { x: 45, y: -4, z: -135.5 },
      tag: "panels",
      visibilityRange: {
        startZ: -123, // Inizia a essere visibile quando la camera è a z=-150
        endZ: -150, // Smette di essere visibile quando la camera supera z=-100
        fadeIn: 10, // Sfuma in entrata nei primi 10 unità
        fadeOut: 15, // Sfuma in uscita negli ultimi 15 unità
        affectsScale: true,
        baseScale: 1,
        scaleVariation: 0.2,
      },
    });

    return this;
  }
}
