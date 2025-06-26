export const GlitchRGBShader = {
    uniforms: {
        "tDiffuse": { value: null },
        "rgbShift": { value: 0.0 },           // RGB shift intensity
        "glitchIntensity": { value: 0.0 },    // Overall glitch intensity
        "digitalNoise": { value: 0.0 },       // Digital noise amount
        "scanLines": { value: 0.0 },          // Scanline effect
        "colorDistortion": { value: 0.0 },    // Color channel distortion
        "time": { value: 0.0 },               // Time for animation
        "lateralDistortion": { value: 0.0 },  // Lateral/horizontal distortion
        "pixelation": { value: 0.0 }          // Pixelation effect
    },
    vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */`
        uniform sampler2D tDiffuse;
        uniform float rgbShift;
        uniform float glitchIntensity;
        uniform float digitalNoise;
        uniform float scanLines;
        uniform float colorDistortion;
        uniform float time;
        uniform float lateralDistortion;
        uniform float pixelation;
        varying vec2 vUv;

        // Random function for noise
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        // Noise function
        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
            vec2 uv = vUv;
            
            // Apply pixelation effect
            if (pixelation > 0.0) {
                float pixelSize = 1.0 + pixelation * 100.0;
                uv = floor(uv * pixelSize) / pixelSize;
            }
            
            // Lateral distortion (horizontal stretching/warping)
            float lateralWarp = sin(uv.y * 10.0 + time * 2.0) * lateralDistortion * 0.1;
            uv.x += lateralWarp;
            
            // Digital glitch lines - horizontal displacement
            float glitchLine = step(0.98, sin(uv.y * 100.0 + time * 10.0));
            float glitchOffset = (random(vec2(floor(uv.y * 100.0), time)) - 0.5) * glitchIntensity * 0.1;
            uv.x += glitchLine * glitchOffset;
            
            // RGB shift based on intensity and position
            float shiftAmount = rgbShift * 0.02;
            vec2 rShift = vec2(shiftAmount, 0.0);
            vec2 gShift = vec2(0.0, 0.0);
            vec2 bShift = vec2(-shiftAmount, 0.0);
            
            // Additional dynamic RGB shift
            float dynamicShift = sin(time * 3.0) * rgbShift * 0.01;
            rShift.y += dynamicShift;
            bShift.y -= dynamicShift;
            
            // Sample RGB channels with shifts
            float r = texture2D(tDiffuse, uv + rShift).r;
            float g = texture2D(tDiffuse, uv + gShift).g;
            float b = texture2D(tDiffuse, uv + bShift).b;
            
            vec4 color = vec4(r, g, b, 1.0);
            
            // Color distortion - shift color channels
            if (colorDistortion > 0.0) {
                float distort = colorDistortion * 0.5;
                color.r = mix(color.r, color.g, distort);
                color.b = mix(color.b, color.r, distort);
            }
            
            // Digital noise
            if (digitalNoise > 0.0) {
                float noiseValue = noise(uv * 100.0 + time * 2.0);
                float digitalEffect = step(1.0 - digitalNoise, noiseValue);
                color.rgb = mix(color.rgb, vec3(digitalEffect), digitalNoise * 0.3);
            }
            
            // Scanlines effect
            if (scanLines > 0.0) {
                float scanLine = sin(uv.y * 800.0) * 0.5 + 0.5;
                color.rgb *= 1.0 - scanLines * 0.3 * scanLine;
            }
            
            // Final glitch intensity modifier
            color.rgb = mix(texture2D(tDiffuse, vUv).rgb, color.rgb, glitchIntensity);
            
            gl_FragColor = color;
        }
    `
}; 