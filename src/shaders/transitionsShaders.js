export const transitionVertexShader = `
           varying vec2 vUv;
           void main() {
               vUv = uv;
               gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
           }
       `
export const transitionFragmentShader = `
           uniform sampler2D texture1;
           uniform sampler2D texture2;
           uniform float progress;
           varying vec2 vUv;
           
           void main() {
               vec4 color1 = texture2D(texture1, vUv);
               vec4 color2 = texture2D(texture2, vUv);
               gl_FragColor = mix(color1, color2, progress);
           }
       `