/*varying vec3 vColor;
varying float vDistance;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength *= 2.0;
  strength = smoothstep(0.7, 0.8, 1.0 - strength);
  gl_FragColor.rgba = vec4(vColor, 1.);
  //gl_FragColor.rgba = vec4(1.,1.,1.,1.);
  gl_FragColor.a *= strength;
  gl_FragColor.a *= vDistance;

  /*vec3 blendColor = vec3(1.0, 0.5, 0.2); // Arancione
vec3 finalColor = mix(blendColor, blendColor, 0.5); // Miscelazione
gl_FragColor = vec4(finalColor, gl_FragColor.a);*/

//}*/

/*varying vec3 vColor;
varying float vDistance;

void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = smoothstep(0.7, 0.8, 1.0 - strength);
    
    // Aggiungi un po' di luminosità quando il mouse è vicino
    vec3 finalColor = vColor;
    finalColor += vec3(0.2) * (1.0 - vDistance); // Aggiungi luminosità
    
    gl_FragColor.rgba = vec4(finalColor, 1.);
    gl_FragColor.a *= strength;
    gl_FragColor.a *= vDistance;
}*/

/*
varying vec3 vColor;
varying float vDistance;
uniform float uMouseOver; // Aggiungi questa uniform per sapere se il mouse è sopra

void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = smoothstep(0.7, 0.8, 1.0 - strength);
    
    // Colore arancione (puoi regolare questi valori)
    vec3 orangeColor = vec3(1.0, 0.5, 0.2);
    
    // Miscela il colore originale con l'arancione in base alla distanza e allo stato del mouse
    vec3 finalColor = mix(vColor, orangeColor, uMouseOver * (1.0 - vDistance) * 0.8);
    
    // Aggiungi luminosità quando il mouse è vicino
    finalColor += vec3(0.3, 0.15, 0.0) * uMouseOver * (1.0 - vDistance);
    
    // Applica la trasparenza
    gl_FragColor = vec4(finalColor, strength * vDistance);
}
*/

varying vec3 vColor;
varying float vDistance;
varying float vMouseEffect;

void main() {
    // Forma della particella
  float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = smoothstep(0.7,0.8,1.0 - strength);
  gl_FragColor.rgba = vec4(vColor,1.);
  gl_FragColor.a *= strength;
  gl_FragColor.a *= vDistance;

    // Aggiungi un effetto glow in base alla reazione al mouse
  float glow = vMouseEffect * (1.0 - strength) * 0.5;

    // Colore finale
  vec3 finalColor = mix(vColor, vec3(1.0), glow);
  gl_FragColor = vec4(finalColor, strength * vDistance);

    // Aumenta la luminosità per le particelle più reattive
  gl_FragColor.rgb += vMouseEffect * vec3(0.2, 0.2, 0.3);
}