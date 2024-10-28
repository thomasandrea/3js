import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import SplineLoader from "@splinetool/loader";
import * as CANNON from "cannon-es";

// Camera setup
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  70,
  100000
);
camera.position.set(105.05, 1133.09, 4661.66);
camera.quaternion.setFromEuler(new THREE.Euler(-0.02, 0.01, 0));

// Scene setup
const scene = new THREE.Scene();

// Physics world setup
const world = new CANNON.World();
world.gravity.set(0, 0, 0);

// Constants
const boundarySize = 500;
const minVelocity = 5;

// WebGL setup
const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//document.body.appendChild(canvas);

// Shader sources
const vertexShaderSource = `
    attribute vec4 a_position;
    varying vec2 v_uv;

    void main() {
        gl_Position = a_position;
        v_uv = a_position.xy * 0.5 + 0.5;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;

    // Funzione per creare curve smooth
    float sdCurve(vec2 p, float t) {
        float y = 0.7 * sin(p.x * 1.5 + t * 0.2);
        float dist = abs(p.y - y);
        return smoothstep(0.15, 0.0, dist);
    }

    // Funzione per il blur gaussiano
    float gaussian(float x, float sigma) {
        return exp(-(x * x) / (2.0 * sigma * sigma));
    }

    void main() {
        vec2 uv = v_uv;
        uv = (uv - 0.5) * 2.0;
        uv.x *= u_resolution.x/u_resolution.y;

        // Tempo rallentato per movimento più fluido
        float t = u_time * 0.2;
        
        // Creazione delle curve principali
        float curve1 = sdCurve(uv, t);
        float curve2 = sdCurve(uv * 1.2 + vec2(0.3, 0.4), t + 2.0);
        
        // Chromatic aberration
        vec2 rOffset = vec2(0.02, 0.02);
        vec2 bOffset = vec2(-0.02, -0.02);
        
        float redCurve1 = sdCurve(uv + rOffset, t);
        float redCurve2 = sdCurve(uv * 1.2 + vec2(0.3, 0.4) + rOffset, t + 2.0);
        
        float blueCurve1 = sdCurve(uv + bOffset, t);
        float blueCurve2 = sdCurve(uv * 1.2 + vec2(0.3, 0.4) + bOffset, t + 2.0);
        
        // Composizione colori con glow
        vec3 color = vec3(0.0);
        
        // Rosso
        color.r += redCurve1 * 0.8 + redCurve2 * 0.6;
        // Verde (per il bianco centrale)
        color.g += curve1 * 0.9 + curve2 * 0.7;
        // Blu
        color.b += blueCurve1 * 0.8 + blueCurve2 * 0.6;
        
        // Aggiunta di glow
        float glow = (color.r + color.g + color.b) * 0.3;
        color += glow * vec3(0.1, 0.2, 0.4);
        
        // Regolazione finale luminosità
        color *= 1.2;
        
        gl_FragColor = vec4(color, 1.0);
    }
`;

// Shader compilation function
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create shader program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

// Set up vertex buffer
const positions = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// Create background texture
const backgroundTexture = new THREE.CanvasTexture(canvas);
scene.background = backgroundTexture;

// Spline loader setup
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
    "Banan 2",
];

// Load Spline scene
loader.load("./all_np.spline", (splineScene) => {
    scene.add(splineScene);

    splineScene.traverse((child) => {
        if (child.isGroup) {
            if (groupToAddInteractive.includes(child.name)) {
                const boundingBox = new THREE.Box3().setFromObject(child);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

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

                body.linearDamping = 0;
                body.angularDamping = 0;

                const forceMultiplier = 50;
                body.velocity.set(
                    (Math.random() - 0.5) * forceMultiplier,
                    (Math.random() - 0.5) * forceMultiplier,
                    (Math.random() - 0.5) * forceMultiplier
                );

                child.userData.physicsBody = body;
                const boxHelper = new THREE.BoxHelper(child, 0xff0000);
                child.userData.boxHelper = boxHelper;

                world.addBody(body);
            } else {
                child.visible = false;
            }
        }
        if (child.name.includes("Bitmama")) {
            child.visible = false;
        }
    });
});

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
renderer.setClearAlpha(1);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.0125;

// Window resize handler
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    
    backgroundTexture.needsUpdate = true;
}

// Minimum velocity enforcement
function setMinimumVelocity(body) {
    const velocityMagnitude = body.velocity.length();
    if (velocityMagnitude < minVelocity) {
        const scaleFactor = minVelocity / velocityMagnitude;
        body.velocity.scale(scaleFactor);
    }
}

// Animation loop
function animate(time) {
    world.step(1 / 60);

    // WebGL background rendering
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);
    
    const timeLocation = gl.getUniformLocation(program, "u_time");
    gl.uniform1f(timeLocation, time * 0.001);
    
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    backgroundTexture.needsUpdate = true;

    // Update physics objects
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

// Boundary checking and bouncing
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