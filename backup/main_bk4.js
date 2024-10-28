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

// Crea un canvas per lo shader
const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl");

// Imposta le dimensioni del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Shader
const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;

    void main() {
        gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
        v_uv = a_position; // Mappa da [0, 1] a [0, 1]
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;

    void main() {
        // Effetto di gradiente animato basato sul tempo
        float r = 0.5 + 0.5 * sin(u_time + v_uv.x * 10.0);
        float g = 0.5 + 0.5 * sin(u_time + v_uv.y * 10.0);
        float b = 0.5 + 0.5 * sin(u_time + (v_uv.x + v_uv.y) * 5.0);
        gl_FragColor = vec4(r, g, b, 1.0);
    }
`;

// Crea e compila i shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// Crea il programma del shader
const program = gl.createProgram();
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// Crea un buffer per i vertici
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1
]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// Crea la texture da utilizzare come sfondo
const backgroundTexture = new THREE.CanvasTexture(canvas);
scene.background = backgroundTexture; // Imposta la texture come sfondo







// Carica l'immagine PNG
const image = new Image();
image.src = "./bitmama-bg.png"; // Sostituisci con il percorso alla tua immagine PNG

// Funzione per ridimensionare il canvas e disegnare l'immagine
function resizeCanvas() {
  return;
  canvas.width = window.innerWidth;  // Larghezza del canvas
  canvas.height = window.innerHeight; // Altezza del canvas

  // Calcola il rapporto d'aspetto dell'immagine e del canvas
  const imageAspectRatio = image.width / image.height;
  const canvasAspectRatio = canvas.width / canvas.height;

  let drawWidth, drawHeight;

  // Calcola le dimensioni dell'immagine da disegnare per mantenere il rapporto d'aspetto
  if (imageAspectRatio > canvasAspectRatio) {
    // L'immagine è più larga del canvas
    drawWidth = canvas.width;
    drawHeight = canvas.width / imageAspectRatio;
  } else {
    // L'immagine è più alta del canvas
    drawHeight = canvas.height;
    drawWidth = canvas.height * imageAspectRatio;
  }

  // Calcola le coordinate di disegno per centrare l'immagine
  const offsetX = (canvas.width - drawWidth) / 2;
  const offsetY = (canvas.height - drawHeight) / 2;

  // Disegna l'immagine sul canvas
  //context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  // Crea la CanvasTexture e impostala come sfondo della scena
  const canvasTexture = new THREE.CanvasTexture(canvas);
  //scene.background = canvasTexture; // Imposta la CanvasTexture come sfondo della scena
}

// Quando l'immagine è caricata, ridimensiona il canvas e disegnarla
image.onload = resizeCanvas;

// Inizializza il canvas per il primo rendering
resizeCanvas();

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
      } else {
        child.visible = false;
      }
    }
    console.log(child.name);
    if(child.name.includes("Bitmama")) {
      console.log("remove");
      child.visible = false;
    }
  });
});

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Imposta lo sfondo iniziale della scena
renderer.setClearAlpha(1);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.0125;

window.addEventListener('resize', () => {
  onWindowResize();
  resizeCanvas(); // Ridimensiona il canvas quando la finestra cambia dimensione
});
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvas.width = window.innerWidth;  // Aggiorna il canvas
    canvas.height = window.innerHeight; // Aggiorna l'altezza
    backgroundTexture.needsUpdate = true; // Aggiorna la texture
}

// Funzione per impostare la velocità minima
function setMinimumVelocity(body) {
  const velocityMagnitude = body.velocity.length();

  if (velocityMagnitude < minVelocity) {
    const scaleFactor = minVelocity / velocityMagnitude;
    body.velocity.scale(scaleFactor);
  }
}

// Funzione animate per aggiornare sia la fisica che la grafica
function animate(time) {
  world.step(1 / 60);


  gl.useProgram(program);
    const timeLocation = gl.getUniformLocation(program, "u_time");
    gl.uniform1f(timeLocation, time * 0.001); // Passa il tempo

    // Esegui il rendering nello canvas WebGL
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Abilita l'attributo della posizione
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Disegna il quadrato
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    
    // Aggiorna la texture del canvas
    backgroundTexture.needsUpdate = true;

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

  controls.update();
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
