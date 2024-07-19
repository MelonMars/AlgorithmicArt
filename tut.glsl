// Heavily based off of the tutorial by Kishimisu, and I feel I am now sort of starting to get the hang of shader programming

vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    vec2 uv2 = uv;
    vec3 finalColor = vec3(0.);
    vec3 col;
    float d;
    for (float i=0.;i<3.;i++) {
        uv = fract(uv * 1.5); // 0 <> 0.99
        uv -= 0.5;
        d = length(uv) * exp(-length(uv2));
        d -= 0.5;
        col = palette(length(uv2) + + i * 4. + iTime * 0.5);
        d = sin(d*8. + iTime) / 8.;
        d = abs(d);
        d = smoothstep(0.0, 0.1, d);
        d = pow(d, 1.2);
        d = 0.1 / d;
    }
    finalColor += col * d;
    // Output to screen
    fragColor = vec4(finalColor,1.0);
}