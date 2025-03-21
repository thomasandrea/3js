import * as THREE from "three";

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

const positions = new Float32Array([
    -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
  ]);
  
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


export function initShaders() {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const gl = canvas.getContext("webgl");

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const backgroundTexture = new THREE.CanvasTexture(canvas);

  return { canvas, backgroundTexture, gl, program, positionBuffer };
}

export function updateShaderCanvas(
  canvas,
  gl,
  program,
  backgroundTexture,
  time = 0,
  positionBuffer
) {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.useProgram(program);

  // Imposta uniform per il tempo
  const timeLocation = gl.getUniformLocation(program, "u_time");
  gl.uniform1f(timeLocation, time * 0.001);

  // Imposta uniform per la risoluzione
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

  // Collega il buffer delle posizioni dei vertici
  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // Assicurarsi che il buffer sia collegato
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Effettua il disegno
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  console.log(gl.TRIANGLES);
  gl.drawArrays(gl.TRIANGLES, 0, 6); // Se ancora dà errore, verificare i dati del buffer

  // Aggiorna la texture di sfondo
  backgroundTexture.needsUpdate = true;
}
