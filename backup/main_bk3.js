import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import NodeMaterial from 'three/examples/jsm/nodes/materials/NodeMaterial.js';
import SplineLoader from '@splinetool/loader';
import * as CANNON from 'cannon-es';

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 70, 100000);
camera.position.set(105.05, 1133.09, 4661.66);
camera.quaternion.setFromEuler(new THREE.Euler(-0.02, 0.01, 0));

// Scene
const scene = new THREE.Scene();

// Cannon.js world
const world = new CANNON.World();
world.gravity.set(0, 0, 0); // Nessuna gravità

// Dimensioni del confine e velocità minima
const boundarySize = 500; // Dimensione dei confini del cubo
const minVelocity = 5; // Velocità minima desiderata

// Crea il render target per lo sfondo
const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

// Crea la scena di sfondo
const backgroundScene = new THREE.Scene();
const backgroundCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
backgroundCamera.position.z = 5;

// Aggiungi un oggetto semplice nella scena di sfondo
const bgGeometry = new THREE.PlaneGeometry(10, 10);
const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
backgroundScene.add(bgMesh);

// Funzione per aggiornare l'oggetto di sfondo
function updateBackground() {
  bgMesh.rotation.z += 0.01;
  bgMesh.rotation.x += 0.01;
}

// Funzione per switchare il materiale
function switchMaterial(mesh, glowing) {
  if (glowing) {
      mesh.material = mesh.userData.glowMaterial; // Applica il materiale di bagliore
      setTimeout(() => {
          mesh.material = mesh.userData.originalMaterial; // Ripristina il materiale originale
      }, 300); // Durata del bagliore
  }
}

// Carica la scena Spline
const loader = new SplineLoader();
const groupToAddInteractive = ["Logo_Reply", "molla", "cursor", "star", "occhiali", "bottiglia", "Bicycle", "cube", "Banan 2"];
loader.load('./all_np.spline', (splineScene) => {
  scene.add(splineScene);
  
  splineScene.traverse((child) => {
    if (child.isGroup) {
      if (groupToAddInteractive.includes(child.name)) {
        console.log(child.name); 
        const boundingBox = new THREE.Box3().setFromObject(child);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        
        const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
        const body = new CANNON.Body({
          mass: 1,
          position: new CANNON.Vec3(child.position.x, child.position.y, child.position.z),
          shape: shape
        });

        body.linearDamping = 0;
        body.angularDamping = 0;

        const forceMultiplier = 50;
        body.velocity.set(
          (Math.random() - 0.5) * forceMultiplier,
          (Math.random() - 0.5) * forceMultiplier,
          (Math.random() - 0.5) * forceMultiplier
        );

        child.userData.physicsBody = body;

        // Salva il materiale originale e crea quello per il bagliore
        child.userData.originalMaterial = child.material;
        child.userData.glowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: .5
        });

        const boxHelper = new THREE.BoxHelper(child, 0xff0000);
        child.userData.boxHelper = boxHelper;

        world.addBody(body);
        body.addEventListener("collide", (event) => {
          // Attiva il bagliore alla collisione
           //switchMaterial(child, true); // Commentato per ora
        });
      }
    }
  });
});

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Imposta lo sfondo iniziale della scena
scene.background = new THREE.Color('#000000');
renderer.setClearAlpha(1);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.0125;

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Funzione per impostare la velocità minima
function setMinimumVelocity(body) {
  const velocityMagnitude = body.velocity.length();

  if (velocityMagnitude < minVelocity) {
    const scaleFactor = minVelocity / velocityMagnitude;
    body.velocity.scale(scaleFactor, body.velocity);
  }
}

// Funzione animate per aggiornare sia la fisica che la grafica
function animate(time) {
  world.step(1 / 60);

  // Aggiorna la posizione e rotazione degli oggetti Three.js
  scene.traverse((child) => {
    if (child.isGroup && child.userData.physicsBody) {
      const body = child.userData.physicsBody;

      checkBoundsAndBounce(body);
      setMinimumVelocity(body);
      
      child.position.copy(body.position);
      child.quaternion.copy(body.quaternion);
    }
  });

  // Aggiorna e renderizza la scena di sfondo nel render target
  updateBackground();
  renderer.setRenderTarget(renderTarget);
  renderer.render(backgroundScene, backgroundCamera);
  scene.background = renderTarget.texture;

  // Renderizza la scena principale
  controls.update();
  renderer.setRenderTarget(null); // Torna al buffer di default
  renderer.render(scene, camera);
}

// Funzione per il rimbalzo sui confini
function checkBoundsAndBounce(body) {
  const { x, y, z } = body.position;
  
  if (x < -boundarySize || x > boundarySize) {
    body.velocity.x *= -1;
  }
  if (y < -boundarySize || y > boundarySize) {
    body.velocity.y *= -1;
  }
  if (z < -boundarySize || z > boundarySize) {
    body.velocity.z *= -1;
  }
}
