export const FishEyeShader = {
    uniforms: {
      tDiffuse: { value: null },
      strength: { value: 0.3 }  // Puedes variar esto dinámicamente
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
      uniform float strength;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv - 0.5;
        float r2 = dot(uv, uv);
        vec2 distortedUV = uv * (1.0 + strength * r2) + 0.5;
        if (distortedUV.x < 0.0 || distortedUV.x > 1.0 || distortedUV.y < 0.0 || distortedUV.y > 1.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
          gl_FragColor = texture2D(tDiffuse, distortedUV);
        }
      }
    `
  };
  