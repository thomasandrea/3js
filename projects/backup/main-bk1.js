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
//world.gravity.set(0, -9.82, 0); // Gravità (y negativa)
world.gravity.set(0, 0, 0); 

// Carica la scena Spline
const loader = new SplineLoader();
loader.load('./all_np.spline', (splineScene) => {
  scene.add(splineScene);
  
  // Per ogni oggetto della scena Spline, creiamo un corpo Cannon.js
  splineScene.traverse((child) => {
    if (child.isMesh) {

      if(child.name.indexOf("Bitmama") == -1) {
      console.log(child)
      // Ottieni le dimensioni approssimative dell'oggetto per creare il corpo Cannon.js
      const boundingBox = new THREE.Box3().setFromObject(child);
      const size = new THREE.Vector3();
      const forceMultiplier = 5;
      boundingBox.getSize(size);
      
      // Crea un box di fisica Cannon.js con dimensioni e posizione dell'oggetto
      const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
      const body = new CANNON.Body({
        mass: 1, // Cambia la massa se necessario
        position: new CANNON.Vec3(child.position.x, child.position.y, child.position.z),
        shape: shape
      });

      // Aggiungi una forza casuale iniziale
      /*body.applyForce(
        new CANNON.Vec3((Math.random() - 0.5) * forceMultiplier, (Math.random() - 0.5) * forceMultiplier, (Math.random() - 0.5) * forceMultiplier),
        body.position
      );*/

      // Imposta damping e sleep
    body.linearDamping = 0.9;
    body.angularDamping = 0.9;
    body.allowSleep = true;
    body.sleepSpeedLimit = 0.1;
    body.sleepTimeLimit = .1;

      body.applyForce(
        new CANNON.Vec3(0, 0, 0),
        body.position
      );

      // Sincronizza la posizione del corpo fisico con l'oggetto Three.js
      child.userData.physicsBody = body;
      world.addBody(body);

      const boxHelper = new THREE.BoxHelper(child, 0xff0000); // Rosso per il box di collisione
      scene.add(boxHelper);
      child.userData.boxHelper = boxHelper; // Salva il boxHelper per l'aggiornamento successivo

    }
  }
  });
});

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Scene settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

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
  // Aggiorna la fisica
  world.step(1 / 60);

  // Aggiorna la posizione e rotazione degli oggetti Three.js
  scene.traverse((child) => {
    if (child.isMesh && child.userData.physicsBody) {
      const body = child.userData.physicsBody;
      child.position.copy(body.position);
      child.quaternion.copy(body.quaternion);
      
      // Aggiorna la posizione del box helper
      child.userData.boxHelper.update();
    }
  });

  // Aggiorna i controlli della camera
  controls.update();
  renderer.render(scene, camera);
}
