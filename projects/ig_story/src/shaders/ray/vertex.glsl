uniform float uTime;
attribute vec3 aStartPosition;
attribute vec3 aTargetPosition;
attribute float aSpeed;
attribute float aStartTime;
varying float vAlpha;
varying float vSize;

varying float vProgress;

/*void main() {
    float progress = mod((uTime + aStartTime)* aSpeed, 1.0); // Loop 0→1
    vProgress = progress;

    // Movimento lineare dalla posizione iniziale al target
    vec3 newPosition = mix(aStartPosition, aTargetPosition, progress);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 5.0;
}*/

/*void main() {
    float progress = mod((uTime + aStartTime) * aSpeed, 1.0); // Loop 0→1
    vProgress = progress;

    // Calcolo della posizione con arco
    vec3 newPosition = mix(aStartPosition, aTargetPosition, progress);
    
    // Aggiungi un arco parabolico al movimento
    // La formula 4.0 * progress * (1.0 - progress) crea una parabola che raggiunge il suo massimo a progress = 0.5
    float arcHeight = distance(aStartPosition, aTargetPosition) * 0.15; // Altezza dell'arco (15% della distanza totale)
    float arcFactor = 4.0 * progress * (1.0 - progress); // Fattore parabolico (0→1→0)
    
    // Calcola una direzione "su" per l'arco - assumendo che Y sia verso l'alto
    vec3 upVector = vec3(0.0, 1.0, 0.0);
    
    // Aggiungi l'arco alla posizione interpolata
    newPosition += upVector * arcHeight * arcFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 5.0;
}*/

void main() {
    float progress = mod((uTime + aStartTime) * aSpeed, 1.0); // Loop 0→1
    vProgress = progress;

    // Calcolo della posizione con arco
    vec3 newPosition = mix(aStartPosition, aTargetPosition, progress);
    
    // Aggiungi un arco parabolico al movimento
    // La formula 4.0 * progress * (1.0 - progress) crea una parabola che raggiunge il suo massimo a progress = 0.5
    float arcHeight = distance(aStartPosition, aTargetPosition) * 0.15; // Altezza dell'arco (15% della distanza totale)
    float arcFactor = 4.0 * progress * (1.0 - progress); // Fattore parabolico (0→1→0)
    
    // Calcola una direzione "su" per l'arco - assumendo che Y sia verso l'alto
    vec3 upVector = vec3(0.0, 1.0, 0.0);
    
    // Aggiungi l'arco alla posizione interpolata
    //newPosition += upVector * arcHeight * arcFactor;
    newPosition += upVector ;

    // Riduci la dimensione delle particelle verso la fine
    float sizeScale = 1.0 - progress * 0.7; // Riduce fino al 30% della dimensione originale
    gl_PointSize = 5.0 * sizeScale;
    vSize = gl_PointSize;

    // Imposta l'alpha a 0 solo verso la fine del tracciato (ultimi 30%) senza usare if
    float fadeThreshold = 0.8; // Inizia a diminuire l'alpha quando progress supera 0.7
    
    // Calcola quanto progress ha superato la soglia (sarà 0 se non l'ha superata)
    float fadeAmount = max(0.0, progress - fadeThreshold);
    
    // Normalizza questo valore nell'intervallo 0-1 (dividi per la lunghezza dell'ultimo tratto)
    fadeAmount = fadeAmount / (1.0 - fadeThreshold);
    
    // Alpha sarà 1.0 fino alla soglia, poi diminuirà linearmente fino a 0
    vAlpha = 1.0 - fadeAmount;
    
    // Imposta l'alpha a 0 verso la fine
    //vAlpha = 1.0 - progress; // Alpha va da 1 a 0

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}