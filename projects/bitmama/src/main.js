import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//import { initShaders, updateShaderCanvas } from "./src/shader.js";
import { initPhysicsWorld, updatePhysicsObjects } from "./physics.js";
import { loadSplineScene, updateMovingObject , handleClickScene, onMouseDown, onMouseUp, onMouseMove} from "./sceneLoader.js";
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import Stats from "stats.js";

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 70, 100000);
camera.position.set(0, 1500, 3500);
//camera.lookAt(1000, 10000, 10000)
//camera.quaternion.setFromEuler(new THREE.Euler(5, 1, 1));

// Scene setup
const scene = new THREE.Scene();

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    antialias: false,  // Disabilita l'anti-aliasing per migliori prestazioni
    powerPreference: 'high-performance',  // Usa la GPU ad alte prestazioni
    alpha: true,       // Consenti trasparenza se necessaria
    precision: 'highp' // Usa precisione alta per migliorare la qualità (ma più costoso)
});

// Abilita ombre, ma riduci la risoluzione delle shadow maps
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.width = 1024;
renderer.shadowMap.height = 1024;





renderer.setSize(window.innerWidth, window.innerHeight);

renderer.domElement.classList.add('canvasThree');

document.body.appendChild(renderer.domElement);

//const stats = new Stats();
//stats.showPanel(0); // 0: FPS, 1: ms, 2: memoria (se disponibile)
//document.body.appendChild(stats.dom);

// Orbit controls
/*const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.0125;

controls.target.set(0, 1000, 0);
controls.update();*/


// WebGL Shader Canvas
//const { canvas, backgroundTexture, gl, program , positionBuffer} = initShaders();
//scene.background = backgroundTexture;
//scene.background = new THREE.Color( 0x000000 );


// Physics world setup
const world = initPhysicsWorld();

// Spline scene loading
loadSplineScene(scene, world, camera, renderer);


// Window resize handling
window.addEventListener("resize", onWindowResize);
window.addEventListener("click", (event) => onWindowClick(event));

window.addEventListener("mousedown", (event) => onMouseDown(event, camera) );
window.addEventListener("mousemove", (event) => onMouseMove(event, camera) );
window.addEventListener("mouseup", (event) => onMouseUp(event, camera) );


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //updateShaderCanvas(canvas, gl, program, backgroundTexture, positionBuffer);
}
function onWindowClick(event) {
    handleClickScene(event, camera)
}

// Animation loop
function animate(time) {
    //stats.begin();
    world.step(1 / 30);

    // Update shaders and physics
    //updateShaderCanvas(canvas, gl, program, backgroundTexture, time, positionBuffer);
    updateMovingObject()
    updatePhysicsObjects(scene, world);
    
    //controls.update();
    renderer.render(scene, camera);
    //stats.end();

}

// Start animation
renderer.setAnimationLoop(animate);
