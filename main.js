import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initShaders, updateShaderCanvas } from "./src/shader.js";
import { initPhysicsWorld, updatePhysicsObjects, checkBoundsAndBounce } from "./src/physics.js";
import { loadSplineScene, updateMovingObject , handleClickScene} from "./src/sceneLoader.js";
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
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: ms, 2: memoria (se disponibile)
document.body.appendChild(stats.dom);

// Orbit controls
/*const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.0125;

controls.target.set(0, 1000, 0);
controls.update();*/


// WebGL Shader Canvas
const { canvas, backgroundTexture, gl, program , positionBuffer} = initShaders();
//scene.background = backgroundTexture;
scene.background = new THREE.Color( 0x000000 );


// Physics world setup
const world = initPhysicsWorld();

// Spline scene loading
loadSplineScene(scene, world, camera, renderer);


//load loader
/*const loader = new SVGLoader();
loader.load('logo_bitmama_white.svg', (data) => {
    const paths = data.paths;

    // Definisci i parametri di estrusione
    const extrusionSettings = {
        depth: 1,      // Profondità di estrusione
        bevelEnabled: false, // Nessuno smusso per mantenere i bordi nitidi
    };

    // Itera su ciascun percorso SVG
    paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);

        // Crea una geometria per ogni forma nel percorso
        shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, extrusionSettings);

            // Materiale per l'estrusione
            const material = new THREE.MeshBasicMaterial({ color: path.color, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geometry, material);

            console.log(mesh)
            // Aggiungi la mesh alla scena
            scene.add(mesh);
        });
    });
});*/

/*const loader = new SVGLoader();
loader.load('logo_bitmama_white.svg', (data) => {
    const paths = data.paths;

    // Parametri per l'estrusione
    const extrusionSettings = {
        depth: 2, // Profondità dell'estrusione
        bevelEnabled: false,
    };

    const logoGroup = new THREE.Group();

    // Itera su ciascun percorso dell'SVG
    paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);

        shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, extrusionSettings);
            const material = new THREE.MeshBasicMaterial({
                color: path.color || 0x000000,
                side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geometry, material);
            logoGroup.add(mesh);
        });
    });

    // Scala e posiziona il logo davanti alla telecamera
    logoGroup.scale.set(1, 1, 1); // Adatta la scala del logo
    logoGroup.position.set(0, 0, -100); // Posizionalo davanti alla telecamera
    camera.add(logoGroup); // Aggiungi il logo come figlio della telecamera
    scene.add(camera); // Aggiungi la telecamera con il logo alla scena
});*/



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
    
    //controls.update();
    renderer.render(scene, camera);

    stats.end();

}

// Start animation
renderer.setAnimationLoop(animate);
