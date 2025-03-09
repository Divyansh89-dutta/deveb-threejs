varying float vElevation;
uniform float uColor;

void main() {
    //float v = smoothstep(0.,1.,vElevation);

    vec4 c1 = vec4(1.0,0.5765,0.7176,1.);
    c1.rgb += vElevation*.35;
    vec4 c2 = vec4(1.0,0.5765,0.5176,.87);
    c2.rgb += vElevation*.35;
    vec4 color = mix(c1, c2, uColor);

    gl_FragColor = color;
}