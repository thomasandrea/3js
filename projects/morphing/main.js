import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { AmbientLight, DirectionalLight } from "three";
import vertex from "./src/shaders/vertex.glsl";
import fragment from "./src/shaders/fragment.glsl";

//import brainSrc from '/3d-models/monkey-head/scene.gltf?url'
//import bulbSrc from '/3d-models/rabbit/scene.gltf?url'

import brainSrc from "/3d-models/brain/scene.gltf?url";
import bulbSrc from "/3d-models/bulb/scene.gltf?url";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const uniforms = {
  uTime: { value: 0 },
  uProgress: { value: 0 },
  uMousePos: { value: new THREE.Vector2(0, 0) },
  uMouseOver: { value: 1 }, // Nuova uniform per lo stato del rollover
  uMouseStrength: { value: 1 }, // Forza dell'effetto del mouse
  uMouseRadius: { value: .5 },
  uTargetMousePos: { value: new THREE.Vector2(0, 0) },
  uSmoothFactor: { value: 0.1 }
};
const rotationProgress = { value: 0 };

// Aggiungi nel tuo init()
/*const debugGUI = new dat.GUI();
debugGUI.add(uniforms.uMouseOver, 'value', 0, 1).name('Mouse Over');
debugGUI.add(uniforms.uMouseStrength, 'value', 0, 2).name('Mouse Strength');*/
//debugGUI.add(uniforms.uMouse, 'value').name('Mouse Pos').listen();



// Nel mousemove
//console.log('Mouse:', uniforms.uMouse.value, 'Over:', uniforms.uMouseOver.value);

/**
 * Debug
 */
// const gui = new dat.GUI()
// gui.add(uniforms.uProgress, 'value', 0, 1, 0.01)

gsap.to(uniforms.uProgress, {
  value: 1,
  duration: 2,
  ease: "linear",
  scrollTrigger: {
    trigger: "#app",
    start: "top top",
    end: "bottom bottom",
    scrub: 2,
  },
});

gsap.to(rotationProgress, {
  value: Math.PI * 2, // Rotazione completa
  scrollTrigger: {
    trigger: "#app",
    start: "top top",
    end: "bottom bottom",
    scrub: 2,
  },
});




/**
 * Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
// scene.background = new THREE.Color(0xdedede)
const manager = new THREE.LoadingManager();

const loader = new GLTFLoader(manager);
const models = {
  monkey: null,
  rabbit: null,
};

manager.onLoad = () => {
  createParticles(models);
};

loader.load(bulbSrc, (gltf) => {
  let model;
  gltf.scene.traverse((el) => {
    if (el instanceof THREE.Mesh) {
      model = el;
    }
  });
  //model.geometry.scale(1.75, 1.75, 1.75)
  //model.geometry.rotateY(Math.PI * 0.5)
  model.geometry.rotateX(2 * Math.PI * 0.5);
  model.geometry.scale(2, 2, 2);
  model.geometry.center();
  // scene.add(model)
  models.rabbit = model;
});

loader.load(brainSrc, (gltf) => {
  let model;
  gltf.scene.traverse((el) => {
    if (el instanceof THREE.Mesh) {
      model = el;
    }
  });
  // scene.add(model)
  model.geometry.rotateZ(Math.PI * 0.5);
  //model.geometry.rotateZ(Math.PI * 0.5)
  model.geometry.scale(3, 3, 3);
  models.monkey = model;
  // const sampler = new MeshSurfaceSampler(model).build()
  // createParticles(sampler)
});

/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
// const material = new THREE.MeshStandardMaterial({ color: 'coral' })
// const geometry = new THREE.BoxGeometry(1, 1, 1)

/**
 * Plane
 */
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 'lightgray' })
// const groundGeometry = new THREE.PlaneGeometry(10, 10)
// groundGeometry.rotateX(-Math.PI * 0.5)
// const ground = new THREE.Mesh(groundGeometry, groundMaterial)
// scene.add(ground)

// const mesh = new THREE.Mesh(geometry, material)
// mesh.position.y += 0.5
// scene.add(mesh)

const colors = [
  new THREE.Color("lightgrey"),
  new THREE.Color("darkgrey"),
  new THREE.Color("dimgray"),
];

function createParticles({ monkey, rabbit }) {
  const monkeySampler = new MeshSurfaceSampler(monkey).build();
  const rabbitSampler = new MeshSurfaceSampler(rabbit).build();

  const geometry = new THREE.BufferGeometry();
  const num = 20000;
  const bound = 20;

  const positionArray = new Float32Array(num * 3);
  const position2Array = new Float32Array(num * 3);
  const colorArray = new Float32Array(num * 3);
  const offsetArray = new Float32Array(num);

  const pos = new THREE.Vector3();

  for (let i = 0; i < num; i++) {
    // const x = Math.random() * bound - bound / 2
    // const y = Math.random() * bound - bound / 2
    // const z = Math.random() * bound - bound / 2

    monkeySampler.sample(pos);
    const [x, y, z] = pos;
    positionArray.set([x, y, z], i * 3);

    rabbitSampler.sample(pos);
    const [x2, y2, z2] = pos;
    position2Array.set([x2, y2, z2], i * 3);

    // const r = Math.random()
    // const g = Math.random()
    // const b = Math.random()
    const color = colors[Math.floor(Math.random() * colors.length)];
    const [r, g, b] = color;
    const offset = Math.random();
    offsetArray[i] = offset;
    colorArray.set([r, g, b], i * 3);
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
  geometry.setAttribute(
    "position2",
    new THREE.BufferAttribute(position2Array, 3)
  );
  geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
  geometry.setAttribute("offset", new THREE.BufferAttribute(offsetArray, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
    },
    fragmentShader: fragment,
    vertexShader: vertex,
    transparent: true,
    depthWrite: false,
    //blending:THREE.MultiplyBlending
    blending: THREE.NormalBlending,
    //blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

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
const fov = 60;
const camera = new THREE.PerspectiveCamera(
  fov,
  sizes.width / sizes.height,
  0.1
);
camera.position.set(4, 4, 4);
camera.lookAt(new THREE.Vector3(0, 2.5, 0));

/**
 * Show the axes of coordinates system
 */
// const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialias: window.devicePixelRatio < 2,
  logarithmicDepthBuffer: true,
});

document.body.appendChild(renderer.domElement);
handleResize();

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/**
 * Lights
 */
const ambientLight = new AmbientLight(0xffffff, 1.5);
const directionalLight = new DirectionalLight(0xffffff, 4.5);
directionalLight.position.set(3, 10, 7);
scene.add(ambientLight, directionalLight);

/**
 * Three js Clock
 */
const clock = new THREE.Clock();


// Variabile per l'animazione fluida
const mouseOverProgress = { value: 0 };

// Raycaster per il mouse over
// Aggiungi questa variabile globale
let lastRaycastTime = 0;
const raycaster = new THREE.Raycaster();
let isMouseOver = false;
// Modifica l'event listener del mouse per includere il rollover


window.addEventListener('mousemove', (event) => {

	let lastMouseTime = 0;
const mouseMoveDelay = 16; // ~60fps

const now = performance.now();
    if (now - lastMouseTime < mouseMoveDelay) return;
    lastMouseTime = now;

    // Coordinate normalizzate (-1 a 1) per lo shader
    uniforms.uMousePos.value.x = (event.clientX / window.innerWidth) * 2 - 1;
    uniforms.uMousePos.value.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    /*// Raycasting ottimizzato (solo ogni 100ms)
    const now = Date.now();
    if (now - lastRaycastTime > 100) {
        lastRaycastTime = now;
        
        raycaster.setFromCamera(uniforms.uMousePos.value, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        isMouseOver = intersects.length > 0;
    }*/
});



/*gsap.to(mouseOverProgress, {
	value: isMouseOver ? 1 : 0,
	duration: 0.3,
	ease: 'power2.out'
});*/

/**
 * frame loop
 */
function tic() {
  /**
   * tempo trascorso dal frame precedente
   */
  // const deltaTime = clock.getDelta()
  /**
   * tempo totale trascorso dall'inizio
   */

  gsap.to(mouseOverProgress, {
	value: isMouseOver ? 1 : 0,
	duration: 0.3,
	ease: 'power2.out'
});

uniforms.uMouseOver.value = mouseOverProgress.value;

const delta = clock.getDelta();
    
// Interpolazione morbida verso la posizione del mouse
uniforms.uTargetMousePos.value.lerp(
	uniforms.uMousePos.value,
	uniforms.uSmoothFactor.value * delta * 60
);

//uniforms.uMouseOver.value = mouseOverProgress.value;

  const time = clock.getElapsedTime();
  uniforms.uTime.value = time;
  controls.update();

  /*for (const key in models) {
		if (Object.prototype.hasOwnProperty.call(models, key)) {
			const element = models[key];
			console.log(rotationProgress.value);
			if(element) element.rotation.x = rotationProgress.value;
			
		}
	}*/
  scene.children.forEach((child) => {
    if (child instanceof THREE.Points) {
      child.rotation.y = rotationProgress.value;
    }
  });
  renderer.render(scene, camera);
  requestAnimationFrame(tic);
}

requestAnimationFrame(tic);
window.addEventListener("resize", handleResize);

function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);
}
