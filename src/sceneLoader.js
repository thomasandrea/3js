import SplineLoader from "@splinetool/loader";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const appState = {
  currentAnimation: null,
};

let initialPosition = new THREE.Vector3();
let initialDistance = 0;
let targetPosition = new THREE.Vector3();
let movingObject = null; // Oggetto attualmente in movimento
const movementSpeed = 1; // Velocità di movimento
const moveSpeed = 100; // Velocità di movimento, da regolare secondo le esigenze
const stopThreshold = 0.01;

const geometry = new THREE.SphereGeometry(10, 320, 320); // Adjust radius (0.5) as needed
const material = new THREE.MeshBasicMaterial({
  color: 0xcccccc,
  wireframe: true,
}); // Adjust color and wireframe option
const referenceSphere = new THREE.Mesh(geometry, material);
const clickableObjects = []; 

export function loadSplineScene(scene, world, camera, renderer) {
  const loader = new SplineLoader();
  const groupToAddInteractive = [
    "Logo_Reply",
    "molla",
    "cursor",
    "star",
    "occhiali",
    "bottiglia",
    "Bicycle",
    "cube",
    "Banana",
  ];

  loader.load("./bit.splinecode", (splineScene) => {
    scene.add(splineScene);

    updateSpherePosition(referenceSphere, camera, 1000);
    scene.add(referenceSphere);
    //addSurroundingSphere(scene)

    splineScene.traverse((child) => {
      if (child.isGroup) {
        if (groupToAddInteractive.includes(child.name)) {
          const boundingBox = new THREE.Box3().setFromObject(child);
          const size = new THREE.Vector3();
          boundingBox.getSize(size);

          // Crea e assegna corpo fisico
          const shape = new CANNON.Box(
            new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
          );
          const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(
              child.position.x,
              child.position.y,
              child.position.z
            ),
            shape: shape,
          });
          child.userData.physicsBody = body;
          world.addBody(body);

          const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
          const boxMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
          });
          const boxHelper = new THREE.Mesh(boxGeometry, boxMaterial);
          scene.add(boxHelper);

          child.userData.boxHelper = boxHelper;
          clickableObjects.push(child);
        } else {
          //child.visible = false;
        }
      }
      if (child.name.includes("Bitmama")) child.visible = false;
    });
  });

}

export function updateMovingObject() {
  if (movingObject) {
    const physicsBody = movingObject.userData.physicsBody;
    const currentPosition = new THREE.Vector3().copy(physicsBody.position);
    const distance = currentPosition.distanceTo(targetPosition);

    if (distance > stopThreshold) {
      //console.log(distance, initialDistance)
      // Calcola la direzione verso la posizione target
      const direction = new THREE.Vector3()
        .subVectors(targetPosition, currentPosition)
        .normalize();

      // Applica un easing alla velocità basato sulla distanza
      //const t = 1 - Math.min(distance / initialDistance, 1);

      const t = 1;
      const easedSpeed = easeOutCubic(t) * moveSpeed;

      //const easedSpeed = 100;
      //console.log(distance / initialDistance)
      // Calcola la forza direzionale da applicare al corpo
      const force = new CANNON.Vec3(
        direction.x * easedSpeed,
        direction.y * easedSpeed,
        direction.z * easedSpeed
      );
      // Applica la forza al corpo fisico
      physicsBody.velocity.copy(force);
    } else {
      // Arresta l'oggetto quando è abbastanza vicino
      physicsBody.velocity.set(0, 0, 0);
      movingObject = null;
      physicsBody.sleep();
    }
  }
}


// Gestore per il clic del mouse
export function handleClickScene(event, camera) {
    // Calcola la posizione del mouse in coordinate normalizzate [-1, 1]
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Imposta il raycaster con la posizione del mouse e la direzione della camera
    raycaster.setFromCamera(mouse, camera);

    // Ottieni gli oggetti intersecati
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
      let objectClicked = intersects[0].object;
      while (
        objectClicked.parent &&
        !clickableObjects.includes(objectClicked)
      ) {
        objectClicked = objectClicked.parent;
      }

      const physicsBody = objectClicked.userData.physicsBody;

      if (physicsBody) {
        targetPosition
          .copy(referenceSphere.position)
          .add(referenceSphere.getWorldDirection(new THREE.Vector3()));
        movingObject = objectClicked;
        initialPosition = new THREE.Vector3().copy(physicsBody.position);
        initialDistance = initialPosition.distanceTo(targetPosition);

        appState.currentAnimation = "moveToCamera";

        console.log("clicked");

        // Imposta la posizione finale e la rotazione
        //physicsBody.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
        //physicsBody.quaternion.setFromEuler(0, 0, 0); // Rotazione a zero
        // Rimuovi la velocità precedente
        //physicsBody.velocity.set(0, 0, 0);
      }
    }
  }



function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function addSurroundingSphere(scene) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./bitmama-bg.png"); // Sostituisci con il percorso dell'immagine

  const geometry = new THREE.SphereGeometry(5000, 64, 64); // Raggio grande per avvolgere tutta la scena
  geometry.scale(-1, 1, 1); // Inverte le normali per rendere la texture visibile solo dall'interno

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    //side: THREE.BackSide // Applica la texture solo all'interno
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
}



function updateSpherePosition(sphere, camera, offset) {
  // Ottieni la direzione della camera
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  // Calcola la nuova posizione della sfera
  const newPosition = new THREE.Vector3();
  camera.getWorldPosition(newPosition);
  newPosition.addScaledVector(direction, offset);

  // Assegna la nuova posizione alla sfera
  sphere.position.copy(newPosition);
}
