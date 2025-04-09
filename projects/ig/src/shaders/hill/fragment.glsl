varying vec3 vColor;
varying float vDistance;
varying float vCameraDistance; // Nuova variabile

void main() {
  
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength *= 2.0;
  strength = smoothstep(0.7, 0.8, 1.0 - strength);
  
  // Calcola l'opacità basata sulla distanza della camera
  float opacity = smoothstep(2.0, 8.0, vCameraDistance);
  
  gl_FragColor.rgba = vec4(vColor, 1.);
  gl_FragColor.a *= strength;
  gl_FragColor.a *= vDistance;
  gl_FragColor.a *= opacity; // Applica l'opacità basata sulla distanza della camera
}