Mandelbrot:

The mandelbrot code works by mapping uv to the complex plane, and then running the function fc (z) = z^2 + c, and then graphing the number if it stays under 2, or if it grows greater, how long it takes to grow greater. This implementation essentially squares everything though, so it checks for if it stays under 4 (2^2).
Complex numbers (c=a+bi) are represented by vec2.x being a, and vec2.y being b. 

Blot:
The blot code should be run by Hackclub's Blot: http://blot.hackclub.com/