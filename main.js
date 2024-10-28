import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initShaders, updateShaderCanvas } from "./src/shader.js";
import { initPhysicsWorld, updatePhysicsObjects, checkBoundsAndBounce } from "./src/physics.js";
import { loadSplineScene, updateMovingObject , handleClickScene} from "./src/sceneLoader.js";
import Stats from "stats.js";

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 70, 100000);
camera.position.set(105.05, 2033.09, 3500.66);
camera.quaternion.setFromEuler(new THREE.Euler(-0.02, 0.01, 0));

// Scene setup
const scene = new THREE.Scene();

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: ms, 2: memoria (se disponibile)
document.body.appendChild(stats.dom);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.0125;

// WebGL Shader Canvas
const { canvas, backgroundTexture, gl, program , positionBuffer} = initShaders();
scene.background = backgroundTexture;
scene.background = new THREE.Color( 0x000000 );


// Physics world setup
const world = initPhysicsWorld();

// Spline scene loading
loadSplineScene(scene, world, camera, renderer);

// Window resize handling
window.addEventListener("resize", onWindowResize);
window.addEventListener("click", (event) => onWindowClick(event));




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
    stats.begin();
    world.step(1 / 60);

    // Update shaders and physics
    //updateShaderCanvas(canvas, gl, program, backgroundTexture, time, positionBuffer);
    
    
    updateMovingObject()
    updatePhysicsObjects(scene, world);
    
    controls.update();
    renderer.render(scene, camera);

    stats.end();

}

// Start animation
renderer.setAnimationLoop(animate);
