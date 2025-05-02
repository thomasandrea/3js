import './style.css'
import * as THREE from 'three'
// __controls_import__
// __gui_import__

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Pane } from 'tweakpane'


import { giocondaPaint } from './ModelManager';

/**
 * Debug
 */
// __gui__
const config = {
	example: 5,
}
const pane = new Pane()

pane
	.addBinding(config, 'example', {
		min: 0,
		max: 10,
		step: 0.1,
	})
	.on('change', (ev) => console.log(ev.value))

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xdedede)

// __box__
/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
/*const material = new THREE.MeshStandardMaterial({ color: 'coral' })
const geometry = new THREE.BoxGeometry(1, 1, 1)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.y += 0.5
scene.add(mesh)*/

// __floor__
/**
 * Plane
 */
const groundMaterial = new THREE.MeshStandardMaterial({ color: 'lightgray' })
const groundGeometry = new THREE.PlaneGeometry(10, 10)
groundGeometry.rotateX(-Math.PI * 0.5)
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
//scene.add(ground)

const radius = 16;
const segments = 64;
const geometry = new THREE.CircleGeometry(radius, segments);
//const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });



const vertexShader = `
  varying vec2 vUv;
  uniform float uRadius;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uRadius;

  void main() {
    float dist = length(vUv * 2.0 - 1.0) * uRadius; // Distanza dal centro normalizzata al raggio
    float edgeFactor = smoothstep(uRadius * 0.90, uRadius, dist); // Crea una sfumatura vicino al bordo
    vec3 shadedColor = mix(vec3(0.5), uColor, 1.0 - edgeFactor); // Interpolazione tra grigio (0.5) e il colore originale

    gl_FragColor = vec4(shadedColor, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color(0xFFFFFF) },
    uRadius: { value: radius },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
});


const floor = new THREE.Mesh(geometry, material);
floor.rotation.x = -Math.PI / 2;
scene.add(floor)




const height = 15; // Altezza della parete
const wallThickness = 0.2; // Spessore della parete

const wallGeometry = new THREE.CylinderGeometry(
  radius + wallThickness / 2, // Raggio esterno
  radius + wallThickness / 2, // Raggio esterno (per un cilindro uniforme)
  height,                     // Altezza
  segments,                   // Numero di segmenti radiali
  1,                          // Numero di segmenti verticali
  true   ,
  .26,
 Math.PI*2-.5                 // openEnded: true per creare solo la superficie laterale
);

// Materiale per la parete
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, side: THREE.DoubleSide }); // Grigio
const wall = new THREE.Mesh(wallGeometry, material);

// Posiziona la base della parete al livello del cerchio
wall.position.y = height / 2;
//wall.rotation.x = Math.PI / 2; // Ruota per renderla verticale

scene.add(wall);

let quadro;

giocondaPaint((q) => {
  quadro = q.frontMesh;
  scene.add(q.quadro);
  
})



//scene.add(paint);






/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

/**
 * Camera
 */
const fov = 70;
const camera = new THREE.PerspectiveCamera(
	fov,
	sizes.width / sizes.height,
	0.1
);
camera.position.set(0, 2, 16);
//camera.lookAt(new THREE.Vector3(10000, -20000, -100000));


/**
 * Show the axes of coordinates system
 */
// __helper_axes__
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
// __controls__
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
directionalLight.position.set(3, 10, 7)
scene.add(ambientLight)

/**
 * Three js Clock
 */
// __clock__
// const clock = new THREE.Clock()

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
	// const time = clock.getElapsedTime()

	// __controls_update__
	controls.update()
	camera.lookAt(new THREE.Vector3(0, 2, 0));

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener('resize', handleResize)
window.addEventListener("mousemove", handleMouseMove);

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height

	// camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}


function handleMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth)*2 -1;
  mouse.y = (event.clientY/window.innerHeight)*2 -1;

  raycaster.setFromCamera(mouse, camera);
  //const intersection = new THREE.Vector3();
  //console.log(quadro)
  //raycaster.ray.intersectPlane(quadro, intersection);

  const intersects = raycaster.intersectObject(quadro);

if (intersects.length > 0) {
  const hit = intersects[0];

  // Coordinate UV direttamente disponibili!
  const uv = hit.uv;

  // Esempio: aggiornare uniform
  //shaderMaterial.uniforms.uMouse.value.copy(uv);
  console.log(uv)
  quadro.material.uniforms.uMouse.value.copy(uv);
}




}