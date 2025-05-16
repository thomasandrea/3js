import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

// Shaders
import vertexWorld from "../shaders/world/vertex.glsl";
import fragmentWorld from "../shaders/world/fragment.glsl";
import vertexTree from "../shaders/tree/vertex.glsl";
import fragmentTree from "../shaders/tree/fragment.glsl";
import vertexHill from "../shaders/hill/vertex.glsl";
import fragmentHill from "../shaders/hill/fragment.glsl";

import vertexBranch from "../shaders/branch/vertex.glsl";
import fragmentBranch from "../shaders/branch/fragment.glsl";

import vertexFoliage from "../shaders/foliage/vertex.glsl";
import fragmentFoliage from "../shaders/foliage/fragment.glsl";
import vertexTube from "../shaders/tube/vertex.glsl";
import fragmentTube from "../shaders/tube/fragment.glsl";


import vertexRay from "../shaders/ray/vertex.glsl";
import fragmentRay from "../shaders/ray/fragment.glsl";

import vertexPeople from "../shaders/people/vertex.glsl";
import fragmentPeople from "../shaders/people/fragment.glsl";

import vertexMolecules from "../shaders/molecules/vertex.glsl";
import fragmentMolecules from "../shaders/molecules/fragment.glsl";

// Models
import globeSrc from "/models/globe/world2.gltf?url";
import woodsSrc from "/models/alberi-no-collina/alberi-no-collina.gltf?url";
import hillSrc from "/models/collina/collina.gltf?url";
import branchSrc from "/models/alberi-test-tronco/alberi-test-tronco.gltf?url";
import foliageSrc from "/models/alberi-test-chioma/alberi-test-chioma.gltf?url";

import molecules1Src from "/models/molecules/molecules1.gltf?url";
import person1Src from "/models/people/person1.gltf?url";
import person2Src from "/models/people/person2.gltf?url";
import person3Src from "/models/people/person3.gltf?url";


import { config } from "../config";

// Modello di definizione per ogni tipo di particelle
const PARTICLE_DEFINITIONS = {
  globe: {
    modelPath: globeSrc,
    vertexShader: vertexWorld,
    fragmentShader: fragmentWorld,
    particleCount: 30000,
    transform: (geometry) => {
      geometry.rotateX(-Math.PI * 0.45);
      geometry.rotateY(0);
    },
    position: () => ({
      x: config.models.globe.position.x,
      y: config.models.globe.position.y,
      z: config.models.globe.position.z
    })
  },
  /*woods: {
    modelPath: woodsSrc,
    vertexShader: vertexTree,
    fragmentShader: fragmentTree,
    particleCount: 20000,
    transform: (geometry) => {
      geometry.scale(120, 120, 120);
      geometry.rotateX(-Math.PI * 0.5);
      geometry.center();
    },
    position: () => ({ x: 0, y: -4, z: -20 })
  },*/
  hill: {
    modelPath: hillSrc,
    vertexShader: vertexHill,
    fragmentShader: fragmentHill,
    particleCount: 30000,
    transform: (geometry) => {
      geometry.scale(20, 2, 20);
      geometry.rotateY(-Math.PI * 0.5);
    },
    position: () => ({
      x: config.models.hill.position.x,
      y: config.models.hill.position.y,
      z: config.models.hill.position.z
    })
  },
  branch: {
    modelPath: branchSrc,
    vertexShader: vertexBranch,
    fragmentShader: fragmentBranch,
    particleCount: 3000,
    transform: (geometry) => {
      geometry.rotateX(Math.PI * 0.5);
    },
    position: () => ({ x: 2.5, y: -2.6, z: -20 })
  },
  foliage: {
    modelPath: foliageSrc,
    vertexShader: vertexFoliage,
    fragmentShader: fragmentFoliage,
    particleCount: 8000,
    transform: (geometry) => {
      geometry.rotateX(Math.PI * 0.5);
    },
    position: () => ({ x: 2.5, y: -2.6, z: -20 })
  },
  person: {
    modelPath: person1Src,
    vertexShader: vertexPeople,
    fragmentShader: fragmentPeople,
    particleCount: 5000,
    transform: (geometry) => {
      geometry.rotateX(-Math.PI * 0.45);
      geometry.scale(.5, .5, .5);
      //geometry.rotateY(0);
    },
    position: () => ({
      x: config.models.person1.position.x,
      y: config.models.person1.position.y,
      z: config.models.person1.position.z
    })
  },
  person2: {
    modelPath: person2Src,
    vertexShader: vertexPeople,
    fragmentShader: fragmentPeople,
    particleCount: 5000,
    transform: (geometry) => {
      //geometry.rotateX(-Math.PI * 0.45);
      geometry.scale(.5, .5, .5);
      //geometry.rotateY(0);
    },
    position: () => ({
      x: config.models.person2.position.x,
      y: config.models.person2.position.y,
      z: config.models.person2.position.z
    })
  },
  person3: {
    modelPath: person3Src,
    vertexShader: vertexPeople,
    fragmentShader: fragmentPeople,
    particleCount: 5000,
    transform: (geometry) => {
      //geometry.rotateX(-Math.PI * 0.45);
      geometry.scale(.5, .5, .5);
      //geometry.rotateY(0);
    },
    position: () => ({
      x: config.models.person3.position.x,
      y: config.models.person3.position.y,
      z: config.models.person3.position.z
    })
  },
  molecules1: {
    modelPath: molecules1Src,
    vertexShader: vertexMolecules,
    fragmentShader: fragmentMolecules,
    particleCount: 6000,
    transform: (geometry) => {
      geometry.center();
      geometry.rotateX(-Math.PI * 0.45);
      geometry.scale(.5, .5, .5);
      //geometry.rotateY(0);
    },
    position: () => ({
      x: config.models.molecules1.position.x,
      y: config.models.molecules1.position.y,
      z: config.models.molecules1.position.z
    })
  },
  molecules2: {
    modelPath: molecules1Src,
    vertexShader: vertexMolecules,
    fragmentShader: fragmentMolecules,
    particleCount: 5000,
    transform: (geometry) => {
      //geometry.rotateX(-Math.PI * 0.45);
      geometry.center();
      geometry.scale(.5, .5, .5);
      //geometry.rotateY(0);
    },
    position: () => ({
      x: config.models.molecules2.position.x,
      y: config.models.molecules2.position.y,
      z: config.models.molecules2.position.z
    })
  }
};

export default class ParticleModelsManager {
  constructor(scene = null) {
    this.scene = scene;
    this.setupLoader();
    this.rotationSpeed = Math.PI / 64;
    this.models = {};
    this.activeModels = new Set(); // Tiene traccia dei modelli attualmente aggiunti alla scena
    this.uniforms = {
        uTime: { value: 0 },
    }; // Se hai uniform globali, puoi aggiungerli qui
  }

  setupLoader() {
    this.manager = new THREE.LoadingManager();
    
    this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
      // console.log(`Loading started: ${url}`);
    };

    this.manager.onLoad = () => {
      // console.log("All models loaded!");
    };

    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      // console.log(`Loaded ${itemsLoaded} of ${itemsTotal}: ${url}`);
      // Qui puoi aggiornare una barra di progresso
    };

    this.manager.onError = (url) => {
      console.error(`Error loading ${url}`);
    };

    this.loader = new GLTFLoader(this.manager);
  }

  /**
   * Imposta la scena per il manager
   * @param {THREE.Scene} scene - La scena Three.js
   */
  setScene(scene) {
    this.scene = scene;
    
    // Aggiungi nuovamente tutti i modelli attivi alla nuova scena
    if (this.scene) {
      this.activeModels.forEach(modelId => {
        if (this.models[modelId]) {
          this.scene.add(this.models[modelId]);
        }
      });
    }
  }

  /**
   * Carica un modello e crea un sistema di particelle
   * @param {string} modelId - Identificatore del modello
   * @param {Function} onReady - Callback quando il modello è pronto
   * @param {boolean} addToScene - Se aggiungere automaticamente alla scena
   */
  loadModel(modelId, onReady, addToScene = false) {
    const definition = PARTICLE_DEFINITIONS[modelId];
    if (!definition) {
      console.error(`Model definition not found for: ${modelId}`);
      return;
    }

    this.loader.load(definition.modelPath, (gltf) => {
      // Skip per woods (come nel codice originale)
      if (modelId === 'woods') {
        if (onReady) onReady(null);
        return;
      }

      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });

      // Applica le trasformazioni specifiche per questo modello
      if (definition.transform) {
        definition.transform(model.geometry);
      }

      // Crea le particelle

      //model.geometry.center();
      this.models[modelId] = this.createParticlesFromMesh(
        model,
        definition.vertexShader,
        definition.fragmentShader,
        definition.particleCount
      );

      // Imposta la posizione
      const position = definition.position();
      this.models[modelId].position.set(position.x, position.y, position.z);

      // Aggiungere alla scena se richiesto
      if (addToScene && this.scene) {
        this.addToScene(modelId);
      }

      // Pulisci le risorse
      this.disposeModel(gltf);
      
      // Callback
      if (onReady) onReady(this.models[modelId]);
    });
  }
  
  /**
   * Aggiunge un modello alla scena
   * @param {string} modelId - Identificatore del modello
   * @returns {boolean} - Successo dell'operazione
   */
  addToScene(modelId) {
    if (!this.scene) {
      console.warn("No scene set. Use setScene() first.");
      return false;
    }
    
    if (!this.models[modelId]) {
      console.warn(`Model ${modelId} is not loaded.`);
      return false;
    }
    
    this.scene.add(this.models[modelId]);
    this.activeModels.add(modelId);
    return true;
  }
  
  /**
   * Rimuove un modello dalla scena
   * @param {string} modelId - Identificatore del modello
   * @returns {boolean} - Successo dell'operazione
   */
  removeFromScene(modelId) {
    if (!this.scene || !this.models[modelId]) {
      return false;
    }
    
    this.scene.remove(this.models[modelId]);
    this.activeModels.delete(modelId);
    return true;
  }

  /**
   * Metodo generico per caricare tutti i modelli definiti
   * @param {Function} onAllReady - Callback quando tutti i modelli sono pronti
   * @param {boolean} addToScene - Se aggiungere automaticamente alla scena
   * @param {Array<string>} specificModels - Lista specifica di modelli da caricare (opzionale)
   */
  loadAllModels(onAllReady, addToScene = false, specificModels = null) {
    const modelIds = specificModels || Object.keys(PARTICLE_DEFINITIONS);
    const loadedModels = {};
    let loadedCount = 0;

    modelIds.forEach(modelId => {
      this.loadModel(modelId, (model) => {
        loadedModels[modelId] = model;
        loadedCount++;
        
        if (loadedCount === modelIds.length && onAllReady) {
          onAllReady(loadedModels);
        }
      }, addToScene);
    });
  }
  
  /**
   * Aggiunge tutti i modelli caricati alla scena
   */
  addAllToScene() {
    if (!this.scene) {
      console.warn("No scene set. Use setScene() first.");
      return;
    }
    
    Object.keys(this.models).forEach(modelId => {
      if (this.models[modelId]) {
        this.addToScene(modelId);
      }
    });
  }
  
  /**
   * Rimuove tutti i modelli dalla scena
   */
  removeAllFromScene() {
    if (!this.scene) return;
    
    [...this.activeModels].forEach(modelId => {
      this.removeFromScene(modelId);
    });
  }

  /**
   * Crea il tubo usando la geometria parametrica
   * @param {Function} onReady - Callback quando il tubo è pronto
   * @param {boolean} addToScene - Se aggiungere automaticamente alla scena
   */
  createTube(onReady, addToScene = false) {
    const geometry = new THREE.CylinderGeometry(5.2, 4.8, 80, 64, 304, true);
    geometry.computeVertexNormals();

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        geometry.attributes.position.array,
        3
      )
    );

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexTube,
      fragmentShader: fragmentTube,
      transparent: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.rotateX(Math.PI * 0.5);
    particles.geometry.attributes.position.needsUpdate = true;
    
    const matrix = new THREE.Matrix4().makeTranslation(0, -80, 0);
    particles.geometry.applyMatrix4(matrix);

    this.models.tube = particles;
    
    if (addToScene && this.scene) {
      this.scene.add(this.models.tube);
      this.activeModels.add('tube');
    }
    
    if (onReady) onReady(particles);
  }

  /**
   * Crea i raggi con geometria parametrica
   * @param {Function} onReady - Callback quando i raggi sono pronti
   * @param {boolean} addToScene - Se aggiungere automaticamente alla scena
   */





  creteParticleAround(onReady) {
    const count = 10000; // Numero di particelle
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 500; // z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        void main() {
          gl_PointSize = 10.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          gl_FragColor = vec4(1.0);
        }
      `,
      transparent: true
    });
    
    const points = new THREE.Points(geometry, material);

    if (onReady) onReady(points);


  }




  createRay(onReady, addToScene = false) {
    const beamCount = 6; // 3 colonne x 2 righe
    const particlesPerBeam = 860; // Particelle per fascio
    const particleCount = beamCount * particlesPerBeam;

    const startPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const startTime = new Float32Array(particleCount);

    // Dimensioni della griglia
    const gridWidth = 3;
    const gridHeight = 2;
    const spacingX = .68; // Spazio orizzontale tra i fasci
    const spacingY = .68; // Spazio verticale tra i fasci

    const positions = new Float32Array(particleCount * 3);
    
    for (let beam = 0; beam < beamCount; beam++) {
      // Calcola la posizione del centro del fascio nella griglia
      const col = beam % gridWidth;
      const row = Math.floor(beam / gridWidth);
      const beamCenterX = (col - 0.5) * spacingX; // Centrato sull'asse X
      const beamCenterY = (row - 0.5) * spacingY; // Centrato sull'asse Y

      // Genera le particelle per questo fascio
      for (let i = 0; i < particlesPerBeam; i++) {
        const particleIndex = beam * particlesPerBeam + i;
        const i3 = particleIndex * 3;

        const offsetBeamX = beamCenterX + (Math.random() - 0.5) * 0.23;
        const offsetBeamY = beamCenterY + (Math.random() - 0.5) * 0.23;


        startPositions[i3] =  config.planes.panels.position.x -10 + offsetBeamX;
        startPositions[i3 + 1] =  config.planes.panels.position.y +12  + offsetBeamY;
        startPositions[i3 + 2] =  config.planes.panels.position.z;

        targetPositions[i3] = config.planes.panels.position.x + offsetBeamX;
        targetPositions[i3 + 1] =config.planes.panels.position.y - 1+ offsetBeamY;
        targetPositions[i3 + 2] = config.planes.panels.position.z+2;

        speeds[particleIndex] = Math.random() * 10 + 10;
        startTime[particleIndex] = Math.random();
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aStartPosition", new THREE.BufferAttribute(startPositions, 3));
    geometry.setAttribute("aTargetPosition", new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute("aStartTime", new THREE.BufferAttribute(speeds, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: vertexRay,
      fragmentShader: fragmentRay,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: true,
    });

    this.models.ray = new THREE.Points(geometry, material);
    this.models.ray.frustumCulled = false;
    
    if (addToScene && this.scene) {
      this.scene.add(this.models.ray);
      this.activeModels.add('ray');
    }

    if (onReady) onReady(this.models.ray);
  }

  /**
   * Crea particelle da una mesh
   */
  createParticlesFromMesh(mesh, vertexShader, fragmentShader, numParticle = 20000) {
    const colorParticle = new THREE.Color();
    colorParticle.setRGB(0 / 255, 138 / 255, 194 / 255);

    const sampler = new MeshSurfaceSampler(mesh).build();
    const num = numParticle;
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(num * 3);
    const colorArray = new Float32Array(num * 3);
    const offsetArray = new Float32Array(num);

    const pos = new THREE.Vector3();

    for (let i = 0; i < num; i++) {
      // posizione iniziale sulla superficie della mesh
      sampler.sample(pos);
      positionArray.set([pos.x, pos.y, pos.z], i * 3);

      const [r, g, b] = [colorParticle.r, colorParticle.g, colorParticle.b];
      colorArray.set([r, g, b], i * 3);

      offsetArray[i] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
    geometry.setAttribute("offset", new THREE.BufferAttribute(offsetArray, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        ...this.uniforms,
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    return new THREE.Points(geometry, material);
  }

  /**
   * Pulisci le risorse della mesh caricata
   */
  disposeModel(gltf) {
    gltf.scene.traverse((el) => {
      if (el.isMesh) {
        el.geometry.dispose();
        if (Array.isArray(el.material)) {
          el.material.forEach((mat) => mat.dispose());
        } else {
          el.material.dispose();
        }
      }
    });
  }

  /**
   * Aggiorna lo stato delle particelle (ad esempio rotazioni)
   * @param {number} delta - Delta time per l'animazione
   * @param {THREE.Camera} camera - Camera di riferimento per la visibilità
   */
  update(delta, camera) {
    // Rotazione globo
    if (this.models.globe && this.activeModels.has('globe')) {
      this.models.globe.rotation.y -= this.rotationSpeed * delta;
    }

    if (this.models.molecules1 ) {
      this.models.molecules1.rotation.x -= this.rotationSpeed * delta*28;
    }
    if (this.models.molecules2 ) {
      this.models.molecules2.rotation.y -= this.rotationSpeed * delta*8;
    }

    if (this.models.ray) {  
      this.models.ray.visible = camera.position.z < -120 && camera.position.z > -150;
      this.models.ray.material.uniforms.uTime.value = performance.now() / 500000;
    }
    if (this.models.foliage) {  
      this.models.foliage.material.uniforms.uTime.value = performance.now() / 1000;
    }
    
    // Puoi aggiungere altre animazioni o aggiornamenti specifici qui
  }
  
  /**
   * Pulisce tutte le risorse e rimuove i modelli dalla scena
   */
  dispose() {
    // Rimuovi tutti i modelli dalla scena
    this.removeAllFromScene();
    
    // Disponi di tutte le geometrie e materiali
    Object.keys(this.models).forEach(modelId => {
      const model = this.models[modelId];
      if (model && model.geometry) {
        model.geometry.dispose();
      }
      if (model && model.material) {
        if (Array.isArray(model.material)) {
          model.material.forEach(mat => mat.dispose());
        } else {
          model.material.dispose();
        }
      }
    });
    
    // Pulisci le collezioni
    this.models = {};
    this.activeModels.clear();
  }
}