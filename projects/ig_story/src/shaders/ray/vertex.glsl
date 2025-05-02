uniform float uTime;
attribute vec3 aStartPosition;
attribute vec3 aTargetPosition;
attribute float aSpeed;
attribute float aStartTime;

varying float vProgress;

void main() {
    float progress = mod((uTime + aStartTime)* aSpeed, 1.0); // Loop 0→1
    vProgress = progress;

    // Movimento lineare dalla posizione iniziale al target
    vec3 newPosition = mix(aStartPosition, aTargetPosition, progress);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 5.0;
}