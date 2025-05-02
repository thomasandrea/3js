void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;

  gl_FragColor = vec4(0.5, 0.78 , 1.0, 1.0);
}
