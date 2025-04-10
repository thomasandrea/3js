import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
// __controls_import__
// __gui_import__

//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import { Pane } from "tweakpane";

import vertexWorld from "./shaders/world/vertex.glsl";
import fragmentWorld from "./shaders/world/fragment.glsl";

import vertexTree from "./shaders/tree/vertex.glsl";
import fragmentTree from "./shaders/tree/fragment.glsl";


import vertexHill from "./shaders/hill/vertex.glsl";
import fragmentHill from "./shaders/hill/fragment.glsl";

import vertexFoliage from "./shaders/foliage/vertex.glsl";
import fragmentFoliage from "./shaders/foliage/fragment.glsl";



//modelli
import globeSrc from "/models/globe/world2.gltf?url";
import woodsSrc from "/models/alberi-no-collina/alberi-no-collina.gltf?url";
import hillSrc from "/models/collina/collina.gltf?url";

import branchSrc from "/models/alberi-test-tronco/alberi-test-tronco.gltf?url";
import foliageSrc from "/models/alberi-test-chioma/alberi-test-chioma.gltf?url";







import cloud1Texture from '/textures/cloud/cloud-1.png?url';
import cloud2Texture from '/textures/cloud/cloud-2.png?url';


import cloud3Texture from '/textures/cloud/cloud-blur-01.png?url';
import cloud4Texture from '/textures/cloud/cloud-blur-02.png?url';

//import backgroundSceneTexture from '/textures/bg-02.jpg?url';
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Debug
 */
// __gui__
const config = {
  progress: 0,
};


/*const pane = new Pane();
pane
  .addBinding(config, "example", {
    min: 0,
    max: 10,
    step: 0.1,
  })
  .on("change", (ev) => console.log(ev.value));*/

/**
 * Scene
 */
const scene = new THREE.Scene();

//scene.background = new THREE.Color(0xFFFFFF)
const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);



// === 2. Scena overlay con quad full-screen ===
//const overlayScene = new THREE.Scene();

const models = {
  globe: null,
  woods: null,
  hill:null,
  branch:null,
  foliage:null
};

const uniforms = {
  uTime: { value: 0 },
  uProgress: { value: 0 },
  uMousePos: { value: new THREE.Vector2(0, 0) },
  uMouseOver: { value: 1 }, // Nuova uniform per lo stato del rollover
  uMouseStrength: { value: 1 }, // Forza dell'effetto del mouse
  uMouseRadius: { value: 0.5 },
  uTargetMousePos: { value: new THREE.Vector2(0, 0) },
  uSmoothFactor: { value: 0.1 },
};



loader.load(hillSrc, (gltf) => {
  //return
  let model;
  gltf.scene.traverse((el) => {
    if (el instanceof THREE.Mesh) {
      model = el;
    }
  });
  model.geometry.scale(20, 2, 20);
  model.geometry.rotateY(-Math.PI * 0.5);
  models.hill = createParticlesFromMesh(model, vertexHill, fragmentHill, 20000);
  models.hill.position.set(0, -4.5, -20);
});

loader.load(branchSrc, (gltf) => {
  //return
  let model;
  gltf.scene.traverse((el) => {
    if (el instanceof THREE.Mesh) {
      model = el;
    }
  });
  //model.geometry.scale(120, 120, 120);
  model.geometry.rotateX(Math.PI * 0.5);
  models.branch = createParticlesFromMesh(model, vertexHill, fragmentHill, 3000);
  models.branch.position.set(2.5, -2.6, -20);
});


loader.load(foliageSrc, (gltf) => {
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
  models.foliage = createParticlesFromMesh(model, vertexFoliage, fragmentFoliage, 8000);
  models.foliage.position.set(2.5, -2.6, -20);
});



loader.load(globeSrc, (gltf) => {
  //return
  let model;
  gltf.scene.traverse((el) => {
    if (el instanceof THREE.Mesh) {
      model = el;
    }
  });

  model.geometry.rotateX(-Math.PI * 0.45);
  model.geometry.rotateY(0 );
  models.globe = createParticlesFromMesh(model, vertexWorld, fragmentWorld, 20000);
  models.globe.position.set(0, 0, -0.6);
});

loader.load(woodsSrc, (gltf) => {
  return;
  let model;
  gltf.scene.traverse((el) => {
    if (el instanceof THREE.Mesh) {
      model = el;
    }
  });
  model.geometry.scale(120,120,120)
  model.geometry.rotateX(-Math.PI * 0.5)
  //model.geometry.rotateX(2 * Math.PI * 0.5);
  model.geometry.center();
  models.woods = createParticlesFromMesh(model, vertexTree, fragmentTree, 20000);
  models.woods.position.set(0, 1, -20);

  //scene.add(model)
});

/* background */

const textureLoader = new THREE.TextureLoader();

textureLoader.load(cloud1Texture, (texture) => {
  const imageAspect = texture.image.width / texture.image.height;
  const height = 0.3; // o quello che vuoi
  const width = height * imageAspect;

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  const cloud = new THREE.Mesh(geometry, material);
  cloud.position.set(-1, 0, 0);

  const startX = -1;
  const startZ = .1;

  const radius = 0.1; // raggio del cerchio
  const speed = 0.2; // velocità di movimento
  let angle = 0; // angolo di rotazione

  gsap.to(
    {},
    {
      duration: 1000, // animazione infinita, si ripete
      repeat: -1, // loop infinito
      onUpdate: () => {
        // Calcola nuove coordinate x, z sulla circonferenza
        cloud.position.x = startX + radius * Math.cos(angle);
        cloud.position.z = startZ + radius * Math.sin(angle);
        angle += (speed * Math.PI) / 180;
      },
    }
  );

  scene.add(cloud);
});


textureLoader.load(cloud2Texture, (texture) => {
  const imageAspect = texture.image.width / texture.image.height;
  const height = 0.5; // o quello che vuoi
  const width = height * imageAspect;

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const cloud = new THREE.Mesh(geometry, material);
  cloud.position.set(1, -0.5, -0.5);
  scene.add(cloud);
});

textureLoader.load(cloud3Texture, (texture) => {
  const imageAspect = texture.image.width / texture.image.height;
  const height = .7; // o quello che vuoi
  const width = height * imageAspect;

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const cloud = new THREE.Mesh(geometry, material);
  cloud.position.set(-3, 0.8, -1.5);
  scene.add(cloud);
});

textureLoader.load(cloud4Texture, (texture) => {
  const imageAspect = texture.image.width / texture.image.height;
  const height = .7; // o quello che vuoi
  const width = height * imageAspect;

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const cloud = new THREE.Mesh(geometry, material);
  cloud.position.set(3, -1.4, -1.5);
  scene.add(cloud);
});


function updateBackgroundWithFade() {
  const bg = document.querySelector('#bgSecondScene');

  // Calcola l'opacità e la scala in base alla posizione della camera
  const maxDistance = -5;  // Inizio della transizione
  const minDistance = -12; // Fine della transizione

  const normalizedPosition = THREE.MathUtils.clamp((camera.position.z - maxDistance) / (minDistance - maxDistance), 0, 1);
  
  const opacity = normalizedPosition; // Lineare da 0 a 1
  const scale = 1 + normalizedPosition * 0.2; // Scala cresce fino a 1.2

  // Applica le modifiche con GSAP
  gsap.to(bg, {
    opacity: opacity,
    scale: scale,
    duration: 0.5
  });
}

function updateFirsSceneText() {
  const bg = document.querySelector('#firstSceneText');
  // Calcola l'opacità e la scala in base alla posizione della camera
  const maxDistance = -.9;  // Inizio della transizione
  const minDistance = 0; // Fine della transizione
  const normalizedPosition = THREE.MathUtils.clamp((camera.position.z - maxDistance) / (minDistance - maxDistance), 0, 1);
  const opacity = normalizedPosition; // Lineare da 0 a 1
  const scale = 1 + normalizedPosition * 0.2; // Scala cresce fino a 1.2

  // Applica le modifiche con GSAP
  gsap.to(bg, {
    opacity: opacity,
   // duration: 0.5
  });
}

function updateSecondSceneText() {
  const bg = document.querySelector('#secondSceneText');
  // Calcola l'opacità e la scala in base alla posizione della camera

  const minDistance = -3; // Fine della transizione
  const maxDistance = 0;  // Inizio della transizione
  
  const normalizedPosition = THREE.MathUtils.clamp((camera.position.z - maxDistance) / (minDistance - maxDistance), 0, 1);

  const opacity = normalizedPosition; // Lineare da 0 a 1
  const scale = 1 + normalizedPosition * 0.2; // Scala cresce fino a 1.2

  // Applica le modifiche con GSAP
  gsap.to(bg, {
    opacity: opacity,
    //duration: 0.5
  });
}


manager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`Inizio caricamento: ${url}`);
};

manager.onLoad = () => {
  console.log("Tutti i modelli caricati!");
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`Caricato ${itemsLoaded} di ${itemsTotal}: ${url}`);
  // puoi aggiornare una barra di progresso qui
};

manager.onError = (url) => {
  console.error(`Errore nel caricamento di ${url}`);
};

// Carica più modelli
const urls = ["globe.gltf", "woods.gltf"];

/*urls.forEach((url) => {
  loader.load(url, (gltf) => {
    scene.add(gltf.scene);
  });
});*/


/**
 * render sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const fov = 60;
const camera = new THREE.PerspectiveCamera(
  fov,
  sizes.width / sizes.height,
  0.1,
  200
);
//camera.position.set(3, 1, 3);
//camera.lookAt(new THREE.Vector3(0, 2.5, 0));

/**
 * Path
 */
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 1.5),
  new THREE.Vector3(0, 0, -13.8),
  //new THREE.Vector3(-15, 0, -10),
  //new THREE.Vector3(-5, 0, -60)
]);

const tubeGeom = new THREE.TubeGeometry(curve, 40, 0.01, 40);
const tubeMat = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 1,
  flatShading: true,
  side: 2,
});

const tube = new THREE.Mesh(tubeGeom, tubeMat);

//scene.add(tube)
const state = { progress: 0 };

function stepCamera(progress, delta = 0.0001) {
  const pos = curve.getPointAt(progress);
  //const pos2 = curve.getPointAt(Math.min(progress + delta, 1));
  camera.position.copy(pos);
  //camera.lookAt(pos2);
}

stepCamera(0);

gsap.to(config, {
  progress: 1, // da 0 a 1 → tutto il range della curva
  ease: "none",
  scrollTrigger: {
    trigger: "#app",
    start: "top top",
    end: "bottom bottom",
    scrub: 2,
    /*onUpdate: () => {
      console.log(config)
      //stepCamera(config.progress)
    }*/
  },
});

/**
 * Show the axes of coordinates system
 */
// __helper_axes__
//const axesHelper = new THREE.AxesHelper(3);
//scene.add(axesHelper);

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialias: window.devicePixelRatio < 2,
  alpha: true,
});
renderer.setPixelRatio(1);
//renderer.setClearColor(0x000000, 0);
//renderer.gammaOutput = true;
//renderer.gammaFactor = 2.2;
//renderer.outputEncoding = THREE.LinearEncoding;


renderer.outputEncoding = THREE.sRGBEncoding;
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);
handleResize();

/**
 * OrbitControls
 */
// __controls__
/*const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;*/

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5);
//directionalLight.position.set(3, 10, 7);
//scene.add(ambientLight, directionalLight);
scene.add(ambientLight);

/**
 * Three js Clock
 */
// __clock__
const clock = new THREE.Clock();

/*functions */

function createParticlesFromMesh(mesh, vertexSheader, fragmentShader, numParticle=20000) {
  
  
  
  
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
  geometry.setAttribute('offset', new THREE.BufferAttribute(offsetArray, 1))

  console.log(offsetArray)

  //console.log(colorArray)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
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
  scene.add(particles);
  return particles;
}



/**
 * frame loop
 */
function tic() {
  /**
   * tempo trascorso dal frame precedente
   */
  //const deltaTime = clock.getDelta()
  /**
   * tempo totale trascorso dall'inizio
   */
  //const time = clock.getElapsedTime()

  const delta = clock.getDelta(); // tempo trascorso dal frame precedente (in secondi)
  const time = clock.getElapsedTime()
  // Rotazione a 45° al secondo (in radianti: π/4)
  const rotationSpeed = Math.PI / 64;
  //console.log(models.globe, delta)
  if (models.globe) models.globe.rotation.y -= rotationSpeed * delta;

  //shaderMaterial.uniforms.uProgress.value=time;
  //config.progress=time;
  //console.log(Math.sin(time))
  // __controls_update__
  //controls.update();

  uniforms.uProgress= config.progress;
  uniforms.uTime.value = time
  stepCamera(config.progress);
 updateBackgroundWithFade()
 updateFirsSceneText()
 updateSecondSceneText()

 //renderer.autoClear = false;
  //renderer.clear(); // pulisce il buffer prima del primo render
  //renderer.render(overlayScene, overlayCamera);

  //renderer.clearDepth(); // importante per resettare il depth buffer
  renderer.render(scene, camera);
  requestAnimationFrame(tic);
}



requestAnimationFrame(tic);

window.addEventListener("resize", handleResize);

function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;

  // camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  //const pixelRatio = Math.min(window.devicePixelRatio, 2);
  //renderer.setPixelRatio(pixelRatio);
}
