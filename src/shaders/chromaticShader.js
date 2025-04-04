export const ChromaticAberrationShader = {
    uniforms: {
        "tDiffuse": { value: null },
        "offset": { value: new THREE.Vector2(0.005, 0.005) }  // desplazamiento para R/B
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
      uniform vec2 offset;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        // Muestrear cada canal por separado
        vec4 color;
        color.r = texture2D(tDiffuse, uv + offset).r;   // rojo desplazado +offset
        color.g = texture2D(tDiffuse, uv).g;            // verde sin desplazamiento
        color.b = texture2D(tDiffuse, uv - offset).b;   // azul desplazado -offset
        color.a = 1.0;
        gl_FragColor = color;
      }
    `
};