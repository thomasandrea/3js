import "./style.css";
import * as THREE from "three";
import {config} from "./config"
import ParticleModelsManager from "./managers/ParticleModelsManager";
import PlaneModelManager from "./managers/PlaneModelManager";
import HtmlElementManager from"./managers/HtmlElementManager";
import Navigation from"./managers/NavigationManager";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Pane } from 'tweakpane'

//gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const cameraZLabel = document.querySelector('#debug');

/**
 * Debug
 */
// __gui__
const state = {
  progress: 0,
};
/**
 * render sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Camera
 */
const fov = 60;
const camera = new THREE.PerspectiveCamera(
  fov,
  sizes.width / sizes.height,
  0.1,
  300
);

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

// Creazione istanza
const htmlManager = new HtmlElementManager(camera);

// Aggiunta degli elementi esistenti
htmlManager
  .addFadeElement('#bgSecondScene', config.background.bg2.start, config.background.bg2.end)
  .addFadeElement('#bgThirdScene', config.background.bg3.start, config.background.bg3.end)
  .addFadeElement('#bgFourthScene',config.background.bg4.start, config.background.bg4.end)
  .addFadeElement('#bgFifthScene', config.background.bg5.start, config.background.bg5.end)
  .addFadeElement('#bgSixthScene', config.background.bg6.start, config.background.bg6.end)
  .addTextElement('#firstSceneText',  3.5, -.9)
  .addTextElement('#secondSceneText',-1, -20);


const planeManager = new PlaneModelManager(scene, renderer);
  planeManager.importCloudConfigs();
  planeManager.loadAllPlanes((planes) => {
    console.log(`Caricati ${planes.length} piani`);
});




const particleModelsManager = new ParticleModelsManager(scene);

/*particleModelsManager.loadAllModels((models) => {
  // Tutti i modelli sono caricati
  //scene.add(models.globe);
  //scene.add(models.hill);
  // ...etc
});*/

particleModelsManager.loadAllModels(
  (models) => console.log('Modelli specifici caricati!'), 
  true,  // aggiungi alla scena
  
);

particleModelsManager.createTube((model) => {
  model.position.z=-2
  scene.add(model);
});

particleModelsManager.createRay((model) => {
  //model.position.z=-132
  scene.add(model);
});



const htmlElementManager = new HtmlElementManager(camera);
const uniforms = {
  uTime: { value: 0 },
  uProgress: { value: 0 },
};

/**
 * Path
 */
function createCurveFromConfig(config) {
  // Estrai i punti dalla configurazione
  const points = config.camera.curve.step.map(step => {
    return new THREE.Vector3(step.x, step.y, step.z);
  });
  
  // Crea e restituisci la curva Catmull-Rom
  return new THREE.CatmullRomCurve3(points);
}

// Utilizzo
const curve = createCurveFromConfig(config);

function stepCamera(progress, delta = 0.0001) {
  const pos = curve.getPointAt(progress);
  //const pos2 = curve.getPointAt(Math.min(progress + delta, 1));
  camera.position.copy(pos);
  //camera.lookAt(pos2);
}

stepCamera(0);

/*
gsap.to(config, {
  progress: 1, // da 0 a 1 → tutto il range della curva
  ease: "none",
  scrollTrigger: {
    trigger: "#app",
    start: "top top",
    end: "bottom bottom",
    scrub: 2,
  },
});
*/

const cameraTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#app",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5, // Smooth scrubbing
    //markers: true // Debug (rimuovi in produzione)
  }
});



cameraTimeline
  //.to(state, { progress: 0.3, duration: 3 }, "s1")
  //.to(state, { progress: 0.6, duration: 3 }, "s2")
  .to(state, { progress: 1, duration: 4 }, "s3");



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
scene.add(ambientLight);
//const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5);
//directionalLight.position.set(3, 10, 7);
//scene.add(ambientLight, directionalLight);
/**
 * Three js Clock
 */
// __clock__
const clock = new THREE.Clock();

const navigation = new Navigation(config, cameraTimeline);

/*functions */

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
  const time = clock.getElapsedTime();

  particleModelsManager.update(delta, camera);
  //htmlElementManager.update()
  htmlManager.update();
  planeManager.update(camera);

  //console.log(config.progress);

  uniforms.uProgress = state.progress;
  uniforms.uTime.value = time;
  stepCamera(state.progress);

  navigation.update()

  //stepCamera(.0001);

  renderer.render(scene, camera);
  //updateDebug();
  requestAnimationFrame(tic);
}

tic();
//requestAnimationFrame(tic);

function updateDebug() {
  cameraZLabel.innerText = `camera.position.z = ${camera.position.z.toFixed(2)}`;
  //requestAnimationFrame(updateDebug);
}


window.addEventListener("resize", handleResize);
function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  // camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
}