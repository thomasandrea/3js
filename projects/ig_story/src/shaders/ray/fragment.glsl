varying float vProgress;
varying float vAlpha;
varying float vSize;

void main() {
    vec3 color_base = vec3(0.0, 0.541, 0.761);
    float alpha = 1.0 -smoothstep(0.3, 0.45, distance(gl_PointCoord, vec2(0.5))) ;
    //gl_FragColor = vec4(1.0, 1.0 - vProgress, 0.5, 1.0);
    //gl_FragColor = vec4(color, alpha);


    
    float dist = length(gl_PointCoord - vec2(0.5));
    
    // Se la distanza è maggiore di 0.5, scarta il frammento (per creare punti rotondi)
    if (dist > 0.5) {
        discard;
    }
    
    // Applica il colore con l'alpha che diminuisce verso la fine del percorso
    vec4 color = vec4(color_base, vAlpha); // Colore bianco con alpha variabile
    
    gl_FragColor = color;
    
}