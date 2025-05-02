varying float vDistanceFactor;
varying float vRandomScale;
varying vec3 vColor; // Opzionale: per effetti di colore

// Funzione pseudo-random
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    // Parametri torsione (regolabili)
    float twistIntensity = -.351; // Intensità torsione (radianti per unità di altezza)
    float baseRadius = 5.0; // Raggio base del tubo
    
    // Calcola l'angolo di torsione in base all'altezza
    float twistAngle = position.y * twistIntensity;
    
    // Applica la torsione alle coordinate X/Z
    vec3 twistedPosition = position;
    twistedPosition.x = cos(twistAngle) * position.x - sin(twistAngle) * position.z;
    twistedPosition.z = sin(twistAngle) * position.x + cos(twistAngle) * position.z;
    
    // Posizione mondiale (dopo torsione)
    vec4 worldPosition = modelMatrix * vec4(twistedPosition, 1.0);
    
    // Calcolo dimensione con randomizzazione (come prima)
    float distanceZ = abs(cameraPosition.z - worldPosition.z);
    float distanceFactor = smoothstep(14.0, 2.0, distanceZ);
    float randomScale = (rand(vec2(position.x, position.z)) > 0.8) ? (0.5 + rand(vec2(position.z, position.y)) * 1.2) : 1.0;
    gl_PointSize = 20.0 * distanceFactor * randomScale;
    
    // Passa i dati al fragment shader
    vDistanceFactor = distanceFactor;
    vRandomScale = randomScale;
    vColor = vec3(0.5 + 0.5 * cos(twistAngle), 0.2, 0.8); // Effetto colore opzionale
    gl_Position = projectionMatrix * modelViewMatrix * vec4(twistedPosition, 1.0);
}