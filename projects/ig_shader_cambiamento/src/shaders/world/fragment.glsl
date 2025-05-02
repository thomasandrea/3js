varying vec3 vColor;
varying float vDistance;

void main() {

  
  // float strength = distance(gl_PointCoord, vec2(.0));
  // strength *= 2.0;
  // strength = smoothstep(0.7,0.8,1.0 - strength);
  
  
  // gl_FragColor.rgba = vec4(vColor,1.);
  // gl_FragColor.a *= strength;
  // gl_FragColor.a *= vDistance;


  // float strength = distance(gl_PointCoord, vec2(0.0));
  // strength *= 3.0;
  // strength = smoothstep(0.7, 0.8, 1.0 - strength);

  // vec4 color = vec4(vColor, 1.0);
  // color.a *= strength;
  // color.a *= vDistance; // Se vuoi che le più lontane siano più trasparenti

  // gl_FragColor = color;

  // float dist = distance(gl_PointCoord, vec2(0.5));
  
  // if (dist > 0.5) discard; // ❌ scarta i pixel fuori dal cerchio

  // float strength = dist * 2.0;
  // strength = smoothstep(0.7, 0.8, 1.0 - strength);

  // vec4 color = vec4(vColor, 1.0);
  // color.a *= strength;
  // color.a *= vDistance;

  // gl_FragColor = color;

  // float dist = distance(gl_PointCoord, vec2(0.5));
  // if (dist > 0.5) discard;

  // float strength = dist * 2.0;
  // strength = smoothstep(0.7, 0.8, 1.0 - strength);

  // // la trasparenza decresce con la distanza (vDistance = 1 vicino, 0 lontano)
  // //float fade = smoothstep(0.0, 1.0, vDistance); 
  // float fade = 1.0 - smoothstep(0.0, 1.0, vDistance);

  // vec4 color = vec4(vColor, 1.0);
  // color.a *= strength;
  // color.a *= fade; // attenua con la distanza

  // gl_FragColor = color;


  float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = smoothstep(0.7,0.8,1.0 - strength);
  gl_FragColor.rgba = vec4(vColor,1.);
  gl_FragColor.a *= strength;
  gl_FragColor.a *= vDistance;







}

