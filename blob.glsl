float rand1(float i) {
    return fract(sin(input) * 43758.5453123) * 0.1;
}

float rand2(float input) {
    float x = fract(input * 0.1031) * 0.1;
    x = x * x + sin(x * 0.5);
    return fract(x) * 0.1;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord * 2. - iResolution.xy) / iResolution.y;
    
    uv.x += rand1(iTime);
    uv.y += rand2(iTime);
    // Time varying pixel color
    float d = length(uv);
    
    // Output to screen
    fragColor = vec4(vec3(d),1.0);
}