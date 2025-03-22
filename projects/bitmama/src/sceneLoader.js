import SplineLoader from "@splinetool/loader";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { boundarySizes, shifts } from "./physics.js";
import bitSplineUrl from '/bit.splinecode?url';

const appState = {
  currentAnimation: null,
};

let initialPosition = new THREE.Vector3();
let initialDistance = null;
let targetPosition = new THREE.Vector3();
let movingObject = null; // Oggetto attualmente in movimento

let selectedObject = null;
let offset = new THREE.Vector3();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

const movementSpeed = 1; // Velocità di movimento
const moveSpeed = 1000; // Velocità di movimento, da regolare secondo le esigenze
const stopThreshold = 0.01;
let boxHelper = null;

const geometry = new THREE.SphereGeometry(10, 1, 1); // Adjust radius (0.5) as needed
const material = new THREE.MeshBasicMaterial({
  color: 0xcccccc,
  wireframe: true
}); // Adjust color and wireframe option
const referenceSphere = new THREE.Mesh(geometry, material);
const clickableObjects = [];
let bgGroup = null;


export function loadSplineScene(scene, world, camera, renderer) {
  const loader = new SplineLoader();
  const groupToAddInteractive = [
    "Logo_Reply",
    "molla",
    "cursor",
    "star",
    //"occhiali",
    "bottiglia",
    "Bicycle",
    "cube",
    "Banana",
  ];

  loader.load(bitSplineUrl, (splineScene) => {
    scene.add(splineScene);
    updateSpherePosition(referenceSphere, camera, 1000);
    scene.add(referenceSphere);
    referenceSphere.visible=false;

    /*splineScene.traverse((child) => {
      // Controlla se il figlio è un gruppo con il nome "bg"
      if (child.isGroup && child.name === "bg") {
          // Sposta il gruppo
          bgGroup = child;
          child.position.set(2, 0, -30000); // Sposta il gruppo a (2, 0, 0)
          
          // Ingrandisci il gruppo
          const scaleFactor = 10; // Fattore di scala
          child.scale.set(scaleFactor, scaleFactor, scaleFactor); // Ingrandisce uniformemente
      }
  });*/

    // Trova l'oggetto con il materiale desiderato
    /*let targetMaterial = null;
    splineScene.traverse((child) => {
      if (targetMaterial) return;
      if (child.isGroup && child.name === "bottiglia") {
        // Usa il nome dell'oggetto target

        child.traverse((subChild) => {
          if (targetMaterial) return;
          console.log(child);
          if (subChild.isMesh) {
            targetMaterial = subChild.material;
            return;
            console.log(subChild.material);
          }
        });
      }
    });

    if (targetMaterial) {
      // Crea una geometria sferica
      const sphereGeometry = new THREE.SphereGeometry(1000, 3, 3); // raggio e segmenti
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(sphereGeometry, targetMaterial);
      //const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      console.log("crea sfera");
      // Aggiungi la sfera alla scena
      scene.add(sphere);

      // Posiziona la sfera come desideri
      sphere.position.set(1000, 2, 1000);
    } else {
      console.error("Materiale dell'oggetto non trovato.");
    }*/

    // Imposta la dimensione della scatola
    const boxSize = new THREE.Vector3(
      boundarySizes.x,
      boundarySizes.y,
      boundarySizes.z
    ); // Dimensioni della scatola
    const boxHalfExtents = new CANNON.Vec3(
      boxSize.x / 2,
      boxSize.y / 2,
      boxSize.z / 2
    );

    // Crea la scatola fisica
    const boxShape = new CANNON.Box(boxHalfExtents);
    const boxBody = new CANNON.Body({
      mass: 0, // Imposta a zero per un oggetto statico
      position: new CANNON.Vec3(0, 0, 0), // Posizione centrale
    });
    //boxBody.addShape(boxShape);
    //world.addBody(boxBody); // Aggiungi al mondo fisico

    // Crea la scatola visiva
    const boxGeometry = new THREE.BoxGeometry(
      boxSize.x * 2,
      boxSize.y * 2,
      boxSize.z * 2
    );
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    boxHelper = new THREE.Mesh(boxGeometry, boxMaterial);
    boxHelper.position.set(shifts.x, shifts.y, shifts.z);
    boxHelper.visible=false;
    scene.add(boxHelper); // Aggiungi alla scena
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
            mass: 0.1,
            position: new CANNON.Vec3(
              child.position.x,
              child.position.y,
              child.position.z
            ),
            linearVelocity: new CANNON.Vec3(0, 0, 0),

            shape: shape,
          });
          body.restitution = 1.3;
          child.userData.physicsBody = body;
          world.addBody(body);

          const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
          const boxMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
          });
          const boxHelper = new THREE.Mesh(boxGeometry, boxMaterial);
          //scene.add(boxHelper);

          child.userData.boxHelper = boxHelper;
          child.visible = true;
          clickableObjects.push(child);
          const multiplyForce = 2000;

          // Forza iniziale casuale
          const initialForce = new CANNON.Vec3(
            (Math.random() - 0.5) * multiplyForce, // Forza casuale lungo X
            (Math.random() - 0.5) * multiplyForce, // Forza casuale lungo Y
            (Math.random() - 0.5) * multiplyForce // Forza casuale lungo Z
          );
          const pointOfApplication = new CANNON.Vec3(0, 0, 0);
          body.applyForce(initialForce, pointOfApplication);

          // Rotazione iniziale casuale
          body.angularVelocity.set(
            (Math.random() - 0.5) * 1, // Rotazione casuale lungo X
            (Math.random() - 0.5) * 1, // Rotazione casuale lungo Y
            (Math.random() - 0.5) * 1 // Rotazione casuale lungo Z
          );
        } else {
          //child.visible = false;
        }
      }
    });
  });
}

export function updateMovingObject() {
  if (movingObject) {
    const physicsBody = movingObject.userData.physicsBody;
    const currentPosition = new THREE.Vector3().copy(physicsBody.position);
    const distance = currentPosition.distanceTo(targetPosition);

    // Imposta `initialDistance` una sola volta all'inizio
    if (initialDistance === null) {
      initialDistance = distance;
      console.log("Initial Distance:", initialDistance);
    }

    if (distance > stopThreshold) {
      const direction = new THREE.Vector3()
        .subVectors(targetPosition, currentPosition)
        .normalize();

      // Inizializza `t` come proporzione decrescente man mano che ci si avvicina
      const t = initialDistance > 0 ? distance / initialDistance : 0;
      //console.log("Distance:", distance, "Initial Distance:", initialDistance, "t:", t);

      // Esegui l'easing
      const easedSpeed = easeOutCubic(t) * moveSpeed;
      const maxSpeed = 500;
      const clampedSpeed = Math.min(easedSpeed, maxSpeed);

      const force = new CANNON.Vec3(
        direction.x * clampedSpeed,
        direction.y * clampedSpeed,
        direction.z * clampedSpeed
      );

      physicsBody.velocity.copy(force);
    } else {
      //physicsBody.velocity.set(0, 0, 0);
      //movingObject = null;
      //physicsBody.sleep();
      //initialDistance = null; // Reset per il prossimo movimento
    }
  }

  if(bgGroup){
    //bgGroup.rotation.z += 0.01; 
  }
 
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
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
    while (objectClicked.parent && !clickableObjects.includes(objectClicked)) {
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
      //console.log("clicked");

      // Imposta la posizione finale e la rotazione
      //physicsBody.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
      //physicsBody.quaternion.setFromEuler(0, 0, 0); // Rotazione a zero
      // Rimuovi la velocità precedente
      //physicsBody.velocity.set(0, 0, 0);
    }
  }
}

// Funzione per rilevare l'oggetto selezionato
export function onMouseDown(event, camera) {
  // Calcola la posizione del mouse normalizzata
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Utilizza il raycaster per rilevare gli oggetti
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects);

  if (intersects.length > 0) {
    selectedObject = intersects[0].object;
    while (
      selectedObject.parent &&
      !clickableObjects.includes(selectedObject)
    ) {
      selectedObject = selectedObject.parent;
    }

    document.body.style.cursor = "grabbing";

    // Calcola l'offset tra la posizione dell'oggetto e il punto in cui è stato cliccato
    const intersectPoint = intersects[0].point;
    offset.copy(intersectPoint).sub(selectedObject.position);

    if (selectedObject && selectedObject.userData.physicsBody) {
      // Ripristina la massa del corpo fisico
      selectedObject.userData.physicsBody.mass = 0;
    }
  }
}

export function onMouseMove(event, camera) {
  if (selectedObject) {
    // Calcola la nuova posizione del mouse
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(boxHelper); // Rileva la scatola limite per i movimenti

    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;
      selectedObject.position.copy(intersectPoint.sub(offset));

      // Aggiorna la posizione del corpo fisico

      if (selectedObject && selectedObject.userData.physicsBody) {
        selectedObject.userData.physicsBody.position.copy(
          selectedObject.position
        );
        selectedObject.userData.physicsBody.velocity.set(0, 0, 0); // Imposta la velocità a zero
      }
    }
  }
}

export function onMouseUp(event, camera) {
  if (selectedObject && selectedObject.userData.physicsBody) {
    // Ripristina la massa del corpo fisico
    selectedObject.userData.physicsBody.mass = 0.1;
  }
  document.body.style.cursor = "auto";
  selectedObject = null;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
