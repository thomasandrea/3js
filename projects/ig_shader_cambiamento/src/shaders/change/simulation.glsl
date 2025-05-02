uniform float time;
uniform float delta;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 pos = texture2D(texturePosition, uv);
  vec4 size = texture2D(textureSize, uv);

  // Slight floating motion
  pos.xy += 0.005 * vec2(
    sin(time + uv.x * 10.0),
    cos(time + uv.y * 10.0)
  );

  // Animate size oscillation
  //float newSize = 0.005 + 0.01 * abs(sin(time * 2.0 + uv.x * 3.14));

  gl_FragColor = vec4(pos.xy, pos.zw); // Pass position
}
