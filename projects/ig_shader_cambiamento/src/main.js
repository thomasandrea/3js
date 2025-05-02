import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";




import particleFragmentShader from './shaders/change/fragment.glsl'
import particleVertexShader from './shaders/change/vertex.glsl'
import simulationFragmentShader from './shaders/change/simulation.glsl'


const WIDTH = 12;
const PARTICLES = WIDTH * WIDTH;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// GPU compute
const gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
const dtPosition = gpuCompute.createTexture();
const dtSize = gpuCompute.createTexture();

for (let i = 0; i < PARTICLES; i++) {
  const x = (Math.random() - 0.5) * 2;
  const y = (Math.random() - 0.5) * 2;
  const z = 0;
  dtPosition.image.data[i * 4 + 0] = x;
  dtPosition.image.data[i * 4 + 1] = y;
  dtPosition.image.data[i * 4 + 2] = z;
  dtPosition.image.data[i * 4 + 3] = 1.0;

  dtSize.image.data[i * 4 + 0] = Math.random(); // size
}

const positionVar = gpuCompute.addVariable('texturePosition', simulationFragmentShader, dtPosition);
const sizeVar = gpuCompute.addVariable('textureSize', simulationFragmentShader, dtSize);
gpuCompute.setVariableDependencies(positionVar, [positionVar, sizeVar]);
gpuCompute.setVariableDependencies(sizeVar, [sizeVar, positionVar]);

positionVar.material.uniforms.time = { value: 0.0 };
positionVar.material.uniforms.delta = { value: 0.0 };
sizeVar.material.uniforms.time = { value: 0.0 };
sizeVar.material.uniforms.delta = { value: 0.0 };

gpuCompute.init();

// Geometry
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLES * 3);
const uvs = new Float32Array(PARTICLES * 2);

let p = 0;
for (let i = 0; i < WIDTH; i++) {
  for (let j = 0; j < WIDTH; j++) {
    uvs[p++] = i / (WIDTH - 1);
    uvs[p++] = j / (WIDTH - 1);
  }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

// Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    positions: { value: null },
    sizes: { value: null },
    size: { value: 45.0 }
  },
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader,
  transparent: true
});

const mesh = new THREE.Points(geometry, material);
scene.add(mesh);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const time = clock.elapsedTime;

  positionVar.material.uniforms.time.value = time;
  positionVar.material.uniforms.delta.value = delta;
  sizeVar.material.uniforms.time.value = time;
  sizeVar.material.uniforms.delta.value = delta;

  gpuCompute.compute();

  material.uniforms.positions.value = gpuCompute.getCurrentRenderTarget(positionVar).texture;
  material.uniforms.sizes.value = gpuCompute.getCurrentRenderTarget(sizeVar).texture;

  renderer.render(scene, camera);
}

animate();
