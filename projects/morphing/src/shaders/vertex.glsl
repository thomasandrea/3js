/*attribute vec3 color;
attribute float offset;
attribute vec3 position2;
varying vec3 vColor;
uniform float uTime;
uniform float uProgress;
varying float vDistance;
uniform vec2 uMouse;

void main() {

  vColor = color;
  vec3 pos = mix(position,position2,uProgress);
  pos *= 1. + sin(3.14 * uProgress) * 3.;
  pos.y += sin(uTime * 0.5 * (offset - 0.5) + offset * 10.) * 0.15;
  pos.x += cos(uTime * 0.5 * (offset - 0.5) + offset * 10.) * 0.15;

  vec3 wPos = vec4( modelMatrix * vec4(pos, 1.0) ).xyz;
  float dist = distance(cameraPosition, wPos);

  vDistance = smoothstep(15.,0., dist);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 40. * vDistance * (sin(uTime * 3. + offset * 10.) * 0.4 + 0.6 );

}
*/

/*

attribute vec3 color;
attribute float offset;
attribute vec3 position2;
varying vec3 vColor;
uniform float uTime;
uniform float uProgress;
varying float vDistance;
uniform vec2 uMouse;
uniform float uMouseOver;
uniform float uMouseStrength;

void main() {
    vColor = color;
    
    // Posizione base
    vec3 pos = mix(position, position2, uProgress);
    pos *= 1.0 + sin(3.14 * uProgress) * 3.0;
    
    // Animazione base
    pos.y += sin(uTime * 0.5 * (offset - 0.5) + offset * 10.0) * 0.15;
    pos.x += cos(uTime * 0.5 * (offset - 0.5) + offset * 10.0) * 0.15;
    
    // Calcola la posizione nello spazio mondo
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vec3 wPos = worldPosition.xyz;
    
    // Distanza dalla camera
    float dist = distance(cameraPosition, wPos);
    vDistance = smoothstep(15.0, 0.0, dist);
    
    // Effetto del mouse solo durante il rollover
    if (uMouseOver > 0.5) {
        // Converti la posizione mondiale in coordinate clip
        vec4 clipPosition = projectionMatrix * viewMatrix * worldPosition;
        
        // Normalizza le coordinate clip per ottenere coordinate NDC (-1 to 1)
        vec2 ndc = clipPosition.xy / clipPosition.w;
        
        // Calcola la direzione dal mouse alla particella nello spazio NDC
        vec2 mouseDir = uMouse - ndc;
        float mouseDist = length(mouseDir);
        
        // Calcola la forza dell'effetto
        float force = smoothstep(0.3, 0.0, mouseDist) * uMouseStrength * uMouseOver;
        
        // Calcola la direzione nello spazio mondo
        vec3 displacementDir = vec3(mouseDir.x, 0.0, mouseDir.y);
        
        // Applica lo spostamento nello spazio mondo
        pos += displacementDir * force * (0.5 + offset * 0.5) * 0.1;
        
        // Modifica il colore
        vColor = mix(vColor, vec3(1.0, 0.7, 0.5), force * 0.5);
    }
    
    // Calcola la posizione finale
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_PointSize = 40.0 * vDistance * (sin(uTime * 3.0 + offset * 10.0) * 0.4 + 0.6);
}
*/

/*attribute vec3 color;
attribute float offset;
attribute vec3 position2;
varying vec3 vColor;
uniform float uTime;
uniform float uProgress;
varying float vDistance;
uniform vec2 uMousePos;
uniform float uMouseOver;
uniform float uMouseStrength;

void main() {
  vColor = color;

    // Posizione base
  vec3 pos = mix(position, position2, uProgress);
  pos *= 1.0 + sin(3.14 * uProgress) * 3.0;

    // Animazione base
  pos.y += sin(uTime * 0.5 * (offset - 0.5) + offset * 10.0) * 0.15;
  pos.x += cos(uTime * 0.5 * (offset - 0.5) + offset * 10.0) * 0.15;

    // Calcola la posizione nello spazio mondo
  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vec3 wPos = worldPosition.xyz;

    // Distanza dalla camera
  float dist = distance(cameraPosition, wPos);
  vDistance = smoothstep(15.0, 0.0, dist);

    // Effetto del mouse solo durante il rollover
  /*if(uMouseOver > 0.) {
    vec4 clipPosition = projectionMatrix * viewMatrix * worldPosition;
    vec2 ndc = clipPosition.xy / clipPosition.w;
    vec2 mouseDir = uMouse - ndc;
    float mouseDist = length(mouseDir);

    float force = smoothstep(0.3, 0.0, mouseDist) * uMouseStrength * uMouseOver;

    // Spostamento in tutte e 3 le dimensioni
    vec3 displacementDir = normalize(vec3(mouseDir.x, sin(uTime * 2.0 + offset * 10.0) * 0.5, // Movimento verticale oscillante
    mouseDir.y));

    pos += displacementDir * force * (0.3 + offset * 0.7) * 0.2;

    // Colore che varia in base all'altezza
    float heightFactor = (displacementDir.y + 1.0) * 0.5;
    vec3 hotColor = mix(vec3(1.0, 0.5, 0.2), vec3(1.0, 0.9, 0.6), heightFactor);
    vColor = mix(vColor, hotColor, force * 0.8);
  }*/
/*
  if (uMouseOver > 0.5) {
    vec4 clipPosition = projectionMatrix * viewMatrix * worldPosition;
    vec2 ndc = clipPosition.xy / clipPosition.w;
    vec2 mouseDir = uMousePos - ndc;
    float mouseDist = length(mouseDir);
    
    float force = smoothstep(0.3, 0.0, mouseDist) * uMouseStrength * uMouseOver;
    
    // Aggiunge un effetto di rimbalzo con il tempo
    float bounce = sin(uTime * 5.0 + offset * 10.0) * 0.5 + 0.5;
    
    vec3 displacementDir = normalize(vec3(mouseDir.x, 0.0, mouseDir.y));
    //pos += displacementDir * force * bounce * (0.5 + offset * 0.5) * 0.15;
    
    // Colore con effetto pulsante
    vColor = mix(vColor, vec3(1.0, 0.5 + bounce * 0.2, 0.2), force * 0.7);
}



    // Calcola la posizione finale
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_PointSize = 40.0 * vDistance * (sin(uTime * 3.0 + offset * 10.0) * 0.4 + 0.6);
}
*/


/*
attribute vec3 color;
attribute float offset;
attribute vec3 position2;
varying vec3 vColor;
varying float vDistance;
varying float vMouseEffect; // Nuova variante per l'intensità dell'effetto

uniform float uTime;
uniform float uProgress;
uniform vec2 uMousePos;
uniform float uMouseStrength;
uniform float uMouseRadius;

void main() {
    vColor = color;
    
    // Posizione base
    vec3 pos = mix(position, position2, uProgress);
    pos *= 1.0 + sin(3.14 * uProgress) * 3.0;
    
    // Animazione base
    pos.y += sin(uTime * 0.5 * (offset - 0.5) + offset * 10.0) * 0.15;
    pos.x += cos(uTime * 0.5 * (offset - 0.5) + offset * 10.0) * 0.15;
    
    // Calcola la posizione nello spazio vista
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    // Converti in coordinate normalizzate del dispositivo (NDC)
    vec2 ndc = projectedPosition.xy / projectedPosition.w;
    
    // Calcola la distanza dal mouse
    float mouseDist = length(uMousePos - ndc);
    
    // Calcola l'intensità dell'effetto (0-1)
    vMouseEffect = smoothstep(uMouseRadius, 0.0, mouseDist) * uMouseStrength;
    
    // Applica lo spostamento proporzionale alla distanza
    vec2 dir = normalize(uMousePos - ndc);
    viewPosition.xy += dir * vMouseEffect * (0.5 + offset) * 0.2;
    
    // Aggiorna la posizione proiettata
    projectedPosition = projectionMatrix * viewPosition;
    
    // Distanza dalla camera
    vDistance = smoothstep(15.0, 0.0, -viewPosition.z);
    
    // Modifica il colore in base all'effetto
    vColor = mix(vColor, vec3(1.0, 0.5 + vMouseEffect * 0.3, 0.2), vMouseEffect * 0.8);
    
    gl_Position = projectedPosition;
    gl_PointSize = 40.0 * vDistance * (sin(uTime * 3.0 + offset * 10.0) * 0.4 + 0.6);
}*/


attribute vec3 color;
attribute float offset;
attribute vec3 position2;
varying vec3 vColor;
varying float vDistance;
varying float vMouseEffect;

uniform float uTime;
uniform float uProgress;
uniform vec2 uTargetMousePos; // Usiamo la posizione interpolata
uniform float uMouseStrength;
uniform float uMouseRadius;

void main() {
    vColor = color;
    
    // Posizione base con animazione
    vec3 pos = mix(position, position2, uProgress);
    pos *= 1.0 + sin(3.14 * uProgress) * 3.0;
    
    // Animazione organica
    float slowTime = uTime * 0.3;
    pos.y += sin(slowTime * 0.5 + offset * 20.0) * 0.1;
    pos.x += cos(slowTime * 0.7 + offset * 15.0) * 0.1;
    pos.z += sin(slowTime * 0.3 + offset * 10.0) * 0.05;
    
    // Trasformazioni spaziali
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
    vec4 projectedPosition = projectionMatrix * viewPosition;
    vec2 ndc = projectedPosition.xy / projectedPosition.w;
    
    // Calcola distanza e direzione dal mouse (con posizione ritardata)
    vec2 toMouse = uTargetMousePos - ndc;
    float mouseDist = length(toMouse);
    vec2 dir = normalize(toMouse);
    
    // Effetto mouse con risposta ritardata e fluida
    vMouseEffect = smoothstep(uMouseRadius, 0.0, mouseDist) * uMouseStrength;
    
    // Applica una forza con inerzia (più fluida)
    float inertiaFactor = 0.5 + sin(uTime * 2.0 + offset * 30.0) * 0.3;
    float force = vMouseEffect * inertiaFactor * 0.15;
    
    // Spostamento con effetto "molla"
    viewPosition.xy += dir * force * pow(offset, 2.0);
    
    // Aggiorna la posizione
    projectedPosition = projectionMatrix * viewPosition;
    
    // Effetti visivi
    vDistance = smoothstep(20.0, 0.0, -viewPosition.z);
    vColor = mix(vColor, vec3(1.0, 0.6, 0.3), vMouseEffect * 0.7);
    
    gl_Position = projectedPosition;
    gl_PointSize = 35.0 * vDistance * (0.7 + sin(uTime * 2.0 + offset * 20.0) * 0.3);
}