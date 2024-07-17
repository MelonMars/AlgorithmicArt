vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

// fc(z) = z^2 + c
float mandelbrot(vec2 c) {
    vec2 z = vec2(0.);
    int mi = 100; //Maximum iterations
    for (int i = 0; i<mi; i++) {
        z = vec2(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
        if (dot(z, z) > 4.0) {
            return float(i) / float(mi);
        }
    }
    return 0.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    float ar = iResolution.x / iResolution.y;
    uv.x *= ar;
    uv *= 0.5;
    vec2 c = uv * 3.0 - vec2(2.0 * ar, 1.5);
    
    // Time varying pixel color
    vec3 col = vec3(pal(mandelbrot(c), vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) ));

    // Output to screen
    fragColor = vec4(col,1.0);
}