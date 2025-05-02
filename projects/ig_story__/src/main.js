import "./style.css";
import * as THREE from "three";

import gsap from "gsap"; // Importa GSAP qui!

import CameraManager from "./camera/CameraManager.js";
import SceneManager from "./scene/SceneManager.js";
import BackgroundManager from "./background/BackgroundManager.js";
import AnimationManager from "./animation/AnimationManager.js";
import ModelLoader from "./models/ModelLoader.js"; // Importa ModelLoader!
import { config } from "./config.js";
import * as CONSTANTS from "./constants.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";








/**
 * Scene
 */
const sceneManager = new SceneManager();
const scene = sceneManager.instance;

const manager = new THREE.LoadingManager();

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
const cameraManager = new CameraManager(sizes);
const camera = cameraManager.instance;

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
    antialias: window.devicePixelRatio < 2,
    alpha: true,
});
renderer.setPixelRatio(1);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
handleResize();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

/**
 * Model Loader
 */
const modelLoader = new ModelLoader(scene, manager, { // Istanziato qui!
    uTime: { value: 0 },
    uProgress: { value: 0 },
});

// Carica i modelli utilizzando il modelLoader
modelLoader.loadModel(CONSTANTS.hillSrc, CONSTANTS.vertexHill, CONSTANTS.fragmentHill, 'hill', new THREE.Vector3(20, 2, 20), new THREE.Euler(0, -Math.PI * 0.5, 0), new THREE.Vector3(0, -4.5, -20), 20000);
modelLoader.loadModel(CONSTANTS.branchSrc, CONSTANTS.vertexHill, CONSTANTS.fragmentHill, 'branch', new THREE.Vector3(1, 1, 1), new THREE.Euler(Math.PI * 0.5, 0, 0), new THREE.Vector3(2.5, -2.6, -20), 3000);
modelLoader.loadModel(CONSTANTS.foliageSrc, CONSTANTS.vertexFoliage, CONSTANTS.fragmentFoliage, 'foliage', new THREE.Vector3(1, 1, 1), new THREE.Euler(Math.PI * 0.5, 0, 0), new THREE.Vector3(2.5, -2.6, -20), 8000);
modelLoader.loadModel(CONSTANTS.globeSrc, CONSTANTS.vertexWorld, CONSTANTS.fragmentWorld, 'globe', new THREE.Vector3(1, 1, 1), new THREE.Euler(-Math.PI * 0.45, 0, 0), new THREE.Vector3(0, 0, -0.6), 20000);
// modelLoader.loadModel(CONSTANTS.woodsSrc, CONSTANTS.vertexTree, CONSTANTS.fragmentTree, 'woods', new THREE.Vector3(120, 120, 120), new THREE.Euler(-Math.PI * 0.5, 0, 0), new THREE.Vector3(0, 1, -20), 20000); // Commentato come nel codice originale

/**
 * Animation Manager
 */
const animationManager = new AnimationManager(config, cameraManager, null); // backgroundManager se lo usi

// Aggiungi i tuoi gestori di eventi basati sulla percentuale di scroll (da 0 a 1)
animationManager.addScrollEventListener(0.2, () => {
    console.log("Siamo al 20% dello scroll!");
    const textElement = document.getElementById('myTextElement');
    if (textElement) {
        textElement.style.opacity = 1;
    }
});

animationManager.addScrollEventListener(0.5, () => {
    console.log("Siamo al 50% dello scroll!");
    const otherElement = document.getElementById('anotherElement');
    if (otherElement) {
        otherElement.style.transform = 'translateY(0)';
    }
});

animationManager.addScrollEventListener(0.8, () => {
    console.log("Siamo all'80% dello scroll!");
    gsap.to(camera.position, { z: -15, duration: 1, overwrite: true });
});

/**
 * Three js Clock
 */
const clock = new THREE.Clock();

function tic() {
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (modelLoader.models.globe) modelLoader.update(delta); // Usa il ModelLoader per aggiornare i modelli

    config.progress = gsap.utils.clamp(0, 1, config.progress);

    cameraManager.update(config.progress);
    if (animationManager) {
        animationManager.checkScrollEvents();
    }

    updateBackgroundWithFade();
    updateFirsSceneText();
    updateSecondSceneText();

    renderer.render(scene, camera);
    requestAnimationFrame(tic);
}

requestAnimationFrame(tic);

window.addEventListener("resize", handleResize);

function handleResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    cameraManager.resize();
    renderer.setSize(sizes.width, sizes.height);
}

function updateBackgroundWithFade() {
    const bg = document.querySelector('#bgSecondScene');
    const maxDistance = -5;
    const minDistance = -12;
    const normalizedPosition = THREE.MathUtils.clamp((camera.position.z - maxDistance) / (minDistance - maxDistance), 0, 1);
    const opacity = normalizedPosition;
    const scale = 1 + normalizedPosition * 0.2;
    gsap.to(bg, { opacity: opacity, scale: scale, duration: 0.5 });
}

function updateFirsSceneText() {
    const bg = document.querySelector('#firstSceneText');
    const maxDistance = -.9;
    const minDistance = 0;
    const normalizedPosition = THREE.MathUtils.clamp((camera.position.z - maxDistance) / (minDistance - minDistance), 0, 1);
    const opacity = normalizedPosition;
    gsap.to(bg, { opacity: opacity });
}

function updateSecondSceneText() {
    const bg = document.querySelector('#secondSceneText');
    const minDistance = -3;
    const maxDistance = 0;
    const normalizedPosition = THREE.MathUtils.clamp((camera.position.z - maxDistance) / (minDistance - maxDistance), 0, 1);
    const opacity = normalizedPosition;
    gsap.to(bg, { opacity: opacity });
}