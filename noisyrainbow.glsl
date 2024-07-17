vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float noise (vec2 p) {
    return fract(sin(p.x*100.+p.y*9648.)*5674.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    float c;
    vec3 col;
    if (mod(iTime - fract(iTime), 2.) == 0.) {
        uv -= 1.;
        c = noise((uv+iTime)*0.0001);
        } else {
        c = noise((uv+iTime)*-0.0001);
    }
    c = 1. / c * 0.3;
    col = col = pal(c, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );
    // Output to screen
    fragColor = vec4(col,1.0);
}