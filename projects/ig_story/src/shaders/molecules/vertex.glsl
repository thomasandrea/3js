attribute vec3 color;
attribute float offset;
attribute vec3 position2;
varying vec3 vColor;
uniform float uTime;
uniform float uProgress;
varying float vDistance;

void main() {

  vColor = color;
  vec3 pos = position;

  vec3 wPos = vec4( modelMatrix * vec4(pos, 1.0) ).xyz;
  float dist = distance(cameraPosition, wPos);

  vDistance = smoothstep(7.6,0., dist);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 30. * vDistance * (sin(.0 * 3. + .0 * 10.) * 0.4 + 0.6 );

}