varying float vDistanceFactor;
void main() {
    vec3 color = vec3(0.0, 0.541, 0.761);

    float alpha = smoothstep(0.0, 0.2, distance(gl_PointCoord, vec2(0.5))) * 0.8;

    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = smoothstep(0.4, 0.6, 1.0 - strength);

    gl_FragColor = vec4(color, 1.0);
    gl_FragColor.a *= strength;
    //gl_FragColor.a *=vDistanceFactor;
    gl_FragColor.a *=smoothstep(0.2, .8, vDistanceFactor); ;
 //gl_FragColor.a = 1.;
}