import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// __controls_import__
// __gui_import__

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

import vertex from './shaders/world/vertex.glsl'
import fragment from './shaders/world/fragment.glsl'

import globeSrc from "/models/globe/world2.gltf?url";
import woodsSrc from "/models/japan2/scene.gltf?url";

import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


/**
 * Debug
 */
// __gui__
const config = {
  example: 5,
  progress: 0
};


/*const pane = new Pane();

pane
  .addBinding(config, "example", {
    min: 0,
    max: 10,
    step: 0.1,
  })
  .on("change", (ev) => console.log(ev.value));*/

/**
 * Scene
 */
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0xFFFFFF)
const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);

const models = {
	globe: null,
	woods: null,
}


/*
loader.load(woodsSrc, (gltf) => {
  const geometries = [];
  const material = new THREE.MeshStandardMaterial(); // oppure prendi da una delle mesh

  // Traverse tutte le mesh nel modello
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.updateMatrix(); // Applica trasformazioni locali
      const geom = child.geometry.clone().applyMatrix4(child.matrix);
      geometries.push(geom);
    }
  });

  // Unisci tutte le geometrie
  const mergedGeometry = mergeGeometries(geometries, true);
  const mergedMesh = new THREE.Mesh(mergedGeometry, material);

  scene.add(mergedMesh);
});*/

loader.load(globeSrc, (gltf) => {
  //return
  let model;
  gltf.scene.traverse((el) => {
    if (el instanceof THREE.Mesh) {
      model = el;
    }
  });
 
  //model.geometry.scale(3, 3, 3);
  //model.geometry.center();
  //models.globe=model;
  //model.geometry.rotateY(Math.PI);
  model.geometry.rotateX(-Math.PI * 0.5);

  
  //scene.add(model)
  //model.geometry.rotateY(-Math.PI );
  //model.geometry.rotateX(Math.PI * 0.5);


  models.globe = createParticlesFromMesh(model)
  models.globe.position.set(0,0, -.6);
  //model.geometry.rotateZ(Math.PI * 0.5)
  
  //models.monkey = model;
  // const sampler = new MeshSurfaceSampler(model).build()
  // createParticles(sampler)
});

loader.load(woodsSrc, (gltf) => {
  let model;
  gltf.scene.traverse((el) => {
    if (el instanceof THREE.Mesh) {
      model = el;
    }
  });
  //model.geometry.scale(1.75, 1.75, 1.75)
  //model.geometry.rotateX(Math.PI * 0.5)
  //model.geometry.rotateX(2 * Math.PI * 0.5);
  model.geometry.center();
  model.geometry.scale(.005, .005, .005);
  model.geometry.rotateY( Math.PI *.5);
  model.geometry.rotateZ( Math.PI *.5);
  //model.geometry.translate(0, 0, -50);
  //model.geometry.rotateZ( Math.PI /.5);

  //model.position.set(0,0, -50);
  
  models.woods = createParticlesFromMesh(model)
  models.woods.position.set(0,0, -30);


  //scene.add(model)
});


/* background */

const geometryPalne = new THREE.PlaneGeometry(50, 50)
const texture = new THREE.TextureLoader().load('textures/background_tree.png')

const materialPlane = new THREE.MeshBasicMaterial({ map: texture })
const backgroundPlane = new THREE.Mesh(geometryPalne, materialPlane)

backgroundPlane.position.z = -100
//scene.add(backgroundPlane)





manager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`Inizio caricamento: ${url}`);
};

manager.onLoad = () => {
  console.log('Tutti i modelli caricati!');
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`Caricato ${itemsLoaded} di ${itemsTotal}: ${url}`);
  // puoi aggiornare una barra di progresso qui
};

manager.onError = (url) => {
  console.error(`Errore nel caricamento di ${url}`);
};

// Carica più modelli
const urls = ['globe.gltf', 'woods.gltf'];

/*urls.forEach((url) => {
  loader.load(url, (gltf) => {
    scene.add(gltf.scene);
  });
});*/



// __box__
/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
const material = new THREE.MeshStandardMaterial({ color: "pink" });

const textureImage = new THREE.TextureLoader().load("./wood.jpg", () => {
  console.log("loaded");
});


const geometry = new THREE.BoxGeometry(1, 1, 1,100,100,100);
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y += 0.5;
//scene.add(mesh);

// __floor__
/**
 * Plane
 */
const groundMaterial = new THREE.MeshStandardMaterial({ color: "lightgray" });
const groundGeometry = new THREE.PlaneGeometry(10, 10);
groundGeometry.rotateX(-Math.PI * 0.5);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
//scene.add(ground)

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
//camera.position.set(3, 1, 3);
//camera.lookAt(new THREE.Vector3(0, 2.5, 0));


/**
 * Path
 */
const curve = new THREE.CatmullRomCurve3([
	new THREE.Vector3(0, 0, 1.5),
  new THREE.Vector3(0, 0, -26),
	//new THREE.Vector3(-15, 0, -10),
	//new THREE.Vector3(-5, 0, -60)
])



const tubeGeom = new THREE.TubeGeometry(curve, 40, .01, 40)
const tubeMat = new THREE.MeshNormalMaterial({
	transparent: true,
	opacity: 1,
	flatShading: true,
  side: 2
})


const tube = new THREE.Mesh(tubeGeom, tubeMat)

//scene.add(tube)
const state = { progress: 0 }

function stepCamera(progress, delta = 0.001) {
	const pos = curve.getPointAt(progress)
	const pos2 = curve.getPointAt(Math.min(progress + delta, 1))
	camera.position.copy(pos)
	camera.lookAt(pos2)
}

stepCamera(0)



gsap.to(config, {
  progress: 1, // da 0 a 1 → tutto il range della curva
  ease: "none",
  scrollTrigger: {
    trigger: "#app",
    start: "top top",
    end: "bottom bottom",
    scrub: 2,
    /*onUpdate: () => {
      console.log(config)
      //stepCamera(config.progress)
    }*/
  }
})

/**
 * Show the axes of coordinates system
 */
// __helper_axes__
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialias: window.devicePixelRatio < 2,
  alpha: true
});
renderer.setClearColor(0x000000, 0);
//renderer.gammaOutput = true;
//renderer.gammaFactor = 2.2;
//renderer.outputEncoding = THREE.LinearEncoding;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.outputColorSpace = THREE.SRGBColorSpace;


document.body.appendChild(renderer.domElement);
handleResize();

/**
 * OrbitControls
 */
// __controls__
/*const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;*/

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5);
//directionalLight.position.set(3, 10, 7);
//scene.add(ambientLight, directionalLight);
scene.add(ambientLight);

/**
 * Three js Clock
 */
// __clock__
const clock = new THREE.Clock()




/*functions */

function createParticlesFromMesh(mesh) {

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMousePos: { value: new THREE.Vector2(0, 0) },
    uMouseOver: { value: 1 }, // Nuova uniform per lo stato del rollover
    uMouseStrength: { value: 1 }, // Forza dell'effetto del mouse
    uMouseRadius: { value: 0.5 },
    uTargetMousePos: { value: new THREE.Vector2(0, 0) },
    uSmoothFactor: { value: 0.1 },
  };


const colorParticle = new THREE.Color();
//colorParticle.setHex(0x008AC2);
colorParticle.setRGB(0/255, 138/255, 194/255);

  /*const colors = [
    new THREE.Color("#1CD760").convertSRGBToLinear(),
    //new THREE.Color("#008AC2").convertSRGBToLinear(),
    //new THREE.Color("#008Aa2"),
    //new THREE.Color("#008AC2"),
  ];*/

	const sampler = new MeshSurfaceSampler(mesh).build()
  const num =20000;
	const geometry = new THREE.BufferGeometry()
	const positionArray = new Float32Array(num * 3)
	const colorArray = new Float32Array(num * 3)
	const offsetArray = new Float32Array(num)

	const pos = new THREE.Vector3()

	for (let i = 0; i < num; i++) {
		// posizione iniziale sulla superficie della mesh
		sampler.sample(pos)
		positionArray.set([pos.x, pos.y, pos.z], i * 3)

		// colore casuale tra quelli forniti
		//const [r, g, b] = colors[Math.floor(Math.random() * colors.length)] || [1, 1, 1]

    //const color = new THREE.Color("#008AC2").convertSRGBToLinear()
//colorArray.set([color.r, color.g, color.b], i * 3)

    const [r, g, b] = colorParticle || [1, 1, 1]
		colorArray.set([r, g, b], i * 3)

		offsetArray[i] = Math.random()
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
	geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))


  //console.log(colorArray)

	const material = new THREE.ShaderMaterial({
		uniforms: {
			...uniforms,
		},
		vertexShader: vertex,
		fragmentShader: fragment,
		transparent: true,
		depthWrite: false,
    blending:THREE.NormalBlending,
    //blending:THREE.NoBlending,
     
		//blending: THREE.AdditiveBlending,
	})

	const particles = new THREE.Points(geometry, material)

	scene.add(particles)

	return particles
}





/**
 * frame loop
 */
function tic() {
  /**
   * tempo trascorso dal frame precedente
   */
  //const deltaTime = clock.getDelta()
  /**
   * tempo totale trascorso dall'inizio
   */
  //const time = clock.getElapsedTime()

  const delta = clock.getDelta() // tempo trascorso dal frame precedente (in secondi)

	// Rotazione a 45° al secondo (in radianti: π/4)
	const rotationSpeed = Math.PI / 64
  //console.log(models.globe, delta)
	if(models.globe) models.globe.rotation.y -= rotationSpeed * delta

  //shaderMaterial.uniforms.uProgress.value=time;
  //config.progress=time;
  //console.log(Math.sin(time))

  // __controls_update__
  //controls.update();
  stepCamera(config.progress)

  renderer.render(scene, camera);

  requestAnimationFrame(tic);
}

requestAnimationFrame(tic);

window.addEventListener("resize", handleResize);

function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;

  // camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);

  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);
}
