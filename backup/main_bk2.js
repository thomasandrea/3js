import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SplineLoader from '@splinetool/loader';
import * as CANNON from 'cannon-es'; // Assicurati di avere Cannon.js installato

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 70, 100000);
camera.position.set(105.05, 1133.09, 4661.66);
camera.quaternion.setFromEuler(new THREE.Euler(-0.02, 0.01, 0));

// Scene
const scene = new THREE.Scene();

// Cannon.js world (fisica)
const world = new CANNON.World();
world.gravity.set(0, 0, 0); // Nessuna gravità

// Definisci i confini del cubo
const boundarySize = 500; // Cambia le dimensioni del cubo a tuo piacimento

// Carica la scena Spline
const loader = new SplineLoader();
loader.load('./all_np.spline', (splineScene) => {
  scene.add(splineScene);
  
  // Per ogni oggetto della scena Spline, creiamo un corpo Cannon.js
  splineScene.traverse((child) => {
    if (child.isMesh) {
      if (child.name.indexOf("Bitmama") == -1) {
        const boundingBox = new THREE.Box3().setFromObject(child);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        
        const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
        const body = new CANNON.Body({
          mass: 1, 
          position: new CANNON.Vec3(child.position.x, child.position.y, child.position.z),
          shape: shape
        });

        // Rimuovi il damping per mantenere il movimento continuo
        body.linearDamping = 0;
        body.angularDamping = 0;

        // Aggiungi una forza casuale iniziale per mettere in movimento gli oggetti
        const forceMultiplier = 50;
        body.applyForce(
          new CANNON.Vec3((Math.random() - 0.5) * forceMultiplier, (Math.random() - 0.5) * forceMultiplier, (Math.random() - 0.5) * forceMultiplier),
          body.position
        );

        // Sincronizza la posizione del corpo fisico con l'oggetto Three.js
        child.userData.physicsBody = body;
        world.addBody(body);

        const boxHelper = new THREE.BoxHelper(child, 0xff0000);
        scene.add(boxHelper);
        child.userData.boxHelper = boxHelper;
      }
    }
  });
});

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

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

// Funzione animate per aggiornare sia la fisica che la grafica
function animate(time) {
  world.step(1 / 60);

  // Aggiorna la posizione e rotazione degli oggetti Three.js
  scene.traverse((child) => {
    if (child.isMesh && child.userData.physicsBody) {
      const body = child.userData.physicsBody;

      // Controlla se il corpo è oltre i confini
      checkBoundsAndBounce(body);

      child.position.copy(body.position);
      child.quaternion.copy(body.quaternion);
      
      // Aggiorna la posizione del box helper
      child.userData.boxHelper.update();
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

// Funzione per il rimbalzo sui confini
function checkBoundsAndBounce(body) {
  const { x, y, z } = body.position;
  
  // Controlla il limite su ogni asse e inverte la velocità se oltrepassa i confini
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
