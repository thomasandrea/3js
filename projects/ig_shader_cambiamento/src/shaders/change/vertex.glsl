uniform sampler2D positions;
uniform sampler2D sizes;
uniform float size;

void main() {
  vec4 pos = texture2D(positions, uv);
  vec4 sizeData = texture2D(sizes, uv);

  vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.0);
  gl_PointSize = size * sizeData.x / -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}
