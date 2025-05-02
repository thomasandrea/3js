import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertexWorld from "../shaders/world/vertex.glsl";
import fragmentWorld from "../shaders/world/fragment.glsl";

import vertexTree from "../shaders/tree/vertex.glsl";
import fragmentTree from "../shaders/tree/fragment.glsl";

import vertexHill from "../shaders/hill/vertex.glsl";
import fragmentHill from "../shaders/hill/fragment.glsl";

import vertexFoliage from "../shaders/foliage/vertex.glsl";
import fragmentFoliage from "../shaders/foliage/fragment.glsl";

import vertexTube from "../shaders/tube/vertex.glsl";
import fragmentTube from "../shaders/tube/fragment.glsl";

import vertexRay from "../shaders/ray/vertex.glsl";
import fragmentRay from "../shaders/ray/fragment.glsl";

//modelli
import globeSrc from "/models/globe/world2.gltf?url";
import woodsSrc from "/models/alberi-no-collina/alberi-no-collina.gltf?url";
import hillSrc from "/models/collina/collina.gltf?url";

import branchSrc from "/models/alberi-test-tronco/alberi-test-tronco.gltf?url";
import foliageSrc from "/models/alberi-test-chioma/alberi-test-chioma.gltf?url";

//import backgroundSceneTexture from '/textures/bg-02.jpg?url';
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

import { config } from "../../config";

export default class ParticleModelsManager {
  constructor() {
    this.manager = new THREE.LoadingManager();
    this.rotationSpeed = Math.PI / 64;
    this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
      //console.log(`Inizio caricamento: ${url}`);
    };

    this.manager.onLoad = () => {
      //console.log("Tutti i modelli caricati!");
    };

    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      //console.log(`Caricato ${itemsLoaded} di ${itemsTotal}: ${url}`);
      // puoi aggiornare una barra di progresso qui
    };

    this.manager.onError = (url) => {
      console.error(`Errore nel caricamento di ${url}`);
    };

    this.loader = new GLTFLoader(this.manager);
    this.models = {
      globe: null,
      woods: null,
      hill: null,
      branch: null,
      foliage: null,
      ray: null,
    };
  }

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

  loadHill(onReady) {
    this.loader.load(hillSrc, (gltf) => {
      //return
      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });
      model.geometry.scale(20, 2, 20);
      model.geometry.rotateY(-Math.PI * 0.5);
      this.models.hill = this.createParticlesFromMesh(
        model,
        vertexHill,
        fragmentHill,
        20000
      );
      this.models.hill.position.set(
        config.models.hill.position.x,
        config.models.hill.position.y,
        config.models.hill.position.z
      );
      //return models.hill;

      this.disposeModel(gltf);
      if (onReady) onReady(this.models.hill);
    });
  }

  loadBranch(onReady) {
    this.loader.load(branchSrc, (gltf) => {
      //return
      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });
      //model.geometry.scale(120, 120, 120);
      model.geometry.rotateX(Math.PI * 0.5);
      this.models.branch = this.createParticlesFromMesh(
        model,
        vertexHill,
        fragmentHill,
        3000
      );
      this.models.branch.position.set(2.5, -2.6, -20);

      this.disposeModel(gltf);
      if (onReady) onReady(this.models.branch);
    });
  }

  loadFoliage(onReady) {
    this.loader.load(foliageSrc, (gltf) => {
      //return
      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });
      //model.geometry.scale(20, 2, 20);
      //model.geometry.rotateY(-Math.PI * 0.5);
      model.geometry.rotateX(Math.PI * 0.5);
      this.models.foliage = this.createParticlesFromMesh(
        model,
        vertexFoliage,
        fragmentFoliage,
        8000
      );
      this.models.foliage.position.set(2.5, -2.6, -20);

      this.disposeModel(gltf);
      if (onReady) onReady(this.models.foliage);
    });
  }

  loadGlobe(onReady) {
    this.loader.load(globeSrc, (gltf) => {
      //return
      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });

      model.geometry.rotateX(-Math.PI * 0.45);
      model.geometry.rotateY(0);
      this.models.globe = this.createParticlesFromMesh(
        model,
        vertexWorld,
        fragmentWorld,
        20000
      );
      this.models.globe.position.set(
        config.models.globe.position.x,
        config.models.globe.position.y,
        config.models.globe.position.z
      );

      this.disposeModel(gltf);
      if (onReady) onReady(this.models.globe);
    });
  }

  loadWood(onReady) {
    this.loader.load(woodsSrc, (gltf) => {
      return;
      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });
      model.geometry.scale(120, 120, 120);
      model.geometry.rotateX(-Math.PI * 0.5);
      //model.geometry.rotateX(2 * Math.PI * 0.5);
      model.geometry.center();
      this.models.woods = this.createParticlesFromMesh(
        model,
        vertexTree,
        fragmentTree,
        20000
      );
      this.models.woods.position.set(0, 1, -20);

      this.disposeModel(gltf);
      if (onReady) onReady(this.models.woods);

      //scene.add(model)
    });
  }

  createTube(onReady) {
    const geometry = new THREE.CylinderGeometry(5.2, 4.8, 80, 64, 304, true); // Più segmenti per una curvatura più liscia
    const positionAttribute = geometry.attributes.position;

    const posAttr = geometry.attributes.position;
    const twistAmount = 0.05; // Intensità torsione (radianti per unità di altezza)

    /*for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i); // Altezza del vertice (da -40 a 40)
    const twistAngle = y * twistAmount; // Angolo proporzionale all'altezza
    
    // Coordinate originali
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    
    // Applica rotazione
    const twistedX = x * Math.cos(twistAngle) - z * Math.sin(twistAngle);
    const twistedZ = x * Math.sin(twistAngle) + z * Math.cos(twistAngle);
    
    posAttr.setXYZ(i, twistedX, y, twistedZ);
}*/

    // Modifica i vertici per creare una curvatura concava (raggio minore al centro)
    /*for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i); // y ∈ [-1.5, 1.5] se height=3
      const z = positionAttribute.getZ(i);

      // Curvatura concava: raggio si restringe al centro
      const curveIntensity = 0.7; // Controlla quanto "affondare" il centro (0.5-1.5)
      const radiusScale = 1 + curveIntensity * Math.sin((y * Math.PI) / 3); // Funzione coseno per la concavità
      positionAttribute.setXYZ(i, x * radiusScale, y, z * radiusScale);
    }*/

    // Aggiorna la geometria e le normali per l'illuminazione
    //positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    // Materiale nero lucido per l'effetto buco nero

    // 1. Definisci gli shaders
    const vertexShader = vertexTube;
    const fragmentShader = fragmentTube;

    // 2. Crea lo ShaderMaterial
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      //blending: THREE.AdditiveBlending, // Effetto "glow"
      depthWrite: false, // Migliora l'overlap delle particelle
    });

    // 3. Applica il materiale alla mesh
    //const blackHole = new THREE.Mesh(geometry, particleMaterial);
    //scene.add(blackHole);

    // 3. Estrai SOLO i vertici per la geometria delle particelle

    //geometry.position.z=4;

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        geometry.attributes.position.array,
        3 // 3 valori per vertice (x, y, z)
      )
    );
    //geometry.position.set(0, 0, -500);

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    //particles.position.z = -33;
    particles.rotateX(Math.PI * 0.5);
    particles.geometry.attributes.position.needsUpdate = true;
    const matrix = new THREE.Matrix4().makeTranslation(0, -80, 0);
    particles.geometry.applyMatrix4(matrix);
    //particles.position.z = -10;

    //const group = new THREE.Group();
    //group.position.z = 130;
    //scene.add(group);
    //group.add(particles);
    //particles.updateMatrixWorld();
    //particleGeometry.attributes.position.needsUpdate = true;
    //particles.position.z = -130;
    //geometry.dispose();

    //const blackHole = new THREE.Mesh(geometry, particleMaterial);
    if (onReady) onReady(particles);
  }

  createRay(onReady) {
    const beamCount = 6; // 3 colonne x 2 righe
    const particlesPerBeam = 260; // Particelle per fascio
    const particleCount = beamCount * particlesPerBeam;

    const startPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const startTime = new Float32Array(particleCount);

    // Dimensioni della griglia
    const gridWidth = 3;
    const gridHeight = 2;
    const spacingX = .68; // Spazio orizzontale tra i fasci
    const spacingY = 0.68; // Spazio verticale tra i fasci

    const positions = new Float32Array(particleCount * 3);
    // Posizioni iniziali (sparse in alto a sinistra)
    const globalDirection = new THREE.Vector3(1, -1, 0).normalize();

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

        // Posizione iniziale casuale vicino al centro del fascio
        /*startPositions[i3] = beamCenterX + (Math.random() - 0.5) * 0.03; // X: ±0.15
        startPositions[i3 + 1] = beamCenterY + (Math.random() - 0.5) * 0.03; // Y: ±0.15
        startPositions[i3 + 2] = 0; // Z: 0

        // Target: spostamento lungo la direzione globale
        const distance = 10; // Distanza del movimento
        targetPositions[i3] = startPositions[i3] + globalDirection.x * distance;
        targetPositions[i3 + 1] =
          startPositions[i3 + 1] + globalDirection.y * distance;
        targetPositions[i3 + 2] = 0;*/
        // Posizione iniziale casuale vicino al centro del fascio

        const offsetBeamX = beamCenterX + (Math.random() - 0.5) * 0.23;
        const offsetBeamY = beamCenterY + (Math.random() - 0.5) * 0.23;

        startPositions[i3] = 35+ offsetBeamX; // X: ±0.15
        startPositions[i3 + 1] = 8 +offsetBeamY; // Y: ±0.15
        startPositions[i3 + 2] = -135.5; // Z: 0

        // Target: spostamento lungo la direzione globale
        const distance = 10; // Distanza del movimento
        targetPositions[i3] = 45+ offsetBeamX;
        targetPositions[i3 + 1] = -2 + offsetBeamY ;
        targetPositions[i3 + 2] = -135.4;

       //{ x: 45, y: -4, z: -135.5 },
        // Velocità casuale (per variazione nel movimento)
        speeds[particleIndex] = Math.random() * 10 + 10 ;
        startTime[particleIndex] = Math.random();
        //speeds[particleIndex] = 4;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aStartPosition", new THREE.BufferAttribute(startPositions, 3));
    geometry.setAttribute( "aTargetPosition",new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute("aStartTime", new THREE.BufferAttribute(speeds, 1));
    //geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: vertexRay,
      fragmentShader: fragmentRay,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: true,
    });

    //const particles = new THREE.Points(geometry, material);
    //scene.add(particles);

    this.models.ray = new THREE.Points(geometry, material);
    this.models.ray.frustumCulled=false
    //this.models.ray.position.set(36, 4.5, -132);

    //const points = new THREE.Points(geometry, material);

    if (onReady) onReady(this.models.ray);
  }

  createParticlesFromMesh(
    mesh,
    vertexSheader,
    fragmentShader,
    numParticle = 20000
  ) {
    const colorParticle = new THREE.Color();
    //colorParticle.setHex(0x008AC2);
    colorParticle.setRGB(0 / 255, 138 / 255, 194 / 255);

    /*const colors = [
      new THREE.Color("#1CD760").convertSRGBToLinear(),
      //new THREE.Color("#008AC2").convertSRGBToLinear(),
      //new THREE.Color("#008Aa2"),
      //new THREE.Color("#008AC2"),
    ];*/

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

      // colore casuale tra quelli forniti
      //const [r, g, b] = colors[Math.floor(Math.random() * colors.length)] || [1, 1, 1]
      //const color = new THREE.Color("#008AC2").convertSRGBToLinear()
      //colorArray.set([color.r, color.g, color.b], i * 3)

      const [r, g, b] = colorParticle || [1, 1, 1];
      colorArray.set([r, g, b], i * 3);

      offsetArray[i] = Math.random();
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
    geometry.setAttribute("offset", new THREE.BufferAttribute(offsetArray, 1));


    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        ...this.uniforms,
      },
      vertexShader: vertexSheader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      //blending:THREE.NoBlending,
      //blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);

    //scene.add(particles);
    return particles;
  }

  update(delta, camera) {
    if (this.models.globe)
      this.models.globe.rotation.y -= this.rotationSpeed * delta;
    if (this.models.ray)
      this.models.ray.visible = camera.position.z < -120 && camera.position.z > -150;
      this.models.ray.material.uniforms.uTime.value = performance.now() / 100000;
  }
}
