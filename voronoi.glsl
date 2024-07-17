vec2 noise (vec2 p) {
    vec3 a = fract(p.xyx*vec3(382.452, 6034.574, 2913.23));
    a += dot(a, a+58.21);
    return fract(vec2(a.x*a.y, a.y*a.z));


}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (2. * fragCoord-iResolution.xy)/iResolution.y;

    float ar = iResolution.x / iResolution.y;
    float m = 0.;
    float minDist = 100.;
    float cellIndex = 0.;
    for (float i=0.; i<50.; i++) {
        vec2 n = noise(vec2(i));
        vec2 p = (sin(n * iTime) * 2.5) / ar;
        float d = length(uv-p);
        if (d<minDist) {
            minDist = d;
            cellIndex = i;
        }
        m += smoothstep(0.02, 0.01, d);
    }
    // Output to screen
    fragColor = vec4(vec3(cellIndex/50.),1.0);
}