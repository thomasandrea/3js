attribute vec3 color;
varying vec3 vColor;
uniform float uTime;
uniform float uProgress;
varying float vDistance;
varying float vCameraDistance; // Nuova variabile

void main() {
  vColor = color;

  //vColor = vec3();


//a2ca39
  //vColor = vec3(0.635, 0.792, 0.224);
  //vColor = vec3(0.518, 0.659, 0.149);


  
  vec3 pos = position;
  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vec3 wPos = worldPosition.xyz;
  float dist = distance(cameraPosition, wPos);
  vDistance = smoothstep(16.0, 12., dist);

  // Calcola la distanza della camera sull'asse z
  vCameraDistance = -cameraPosition.z; // Nota il segno negativo

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 16. * vDistance;
}