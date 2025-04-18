// import * as THREE from 'three';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

// export class TransitionsManager {
//     static DEFAULT_TRANSITION_DURATION = 750;
//     static RESIZE_DEBOUNCE_TIME = 100;

//     constructor(mainRenderer, composer) {
//         this.mainRenderer = mainRenderer;
//         this.composer = composer;
//         this.textureLoader = new THREE.TextureLoader(); // Mover aquí el inicializador
//         this.isTransitioning = false;
//         this.resizeTimeout = null;
//         this.currentTransition = null;

//         this.initTransitionScene();
//         this.setupEventListeners();
//     }


//     initTransitionScene() {
//         this.transitionScene = new THREE.Scene();
//         this.transitionCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//         this.geometry = new THREE.PlaneGeometry(2, 2);
//     }

//     setupEventListeners() {
//         window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
//     }

//     // En TransitionsManager.js:
//     handleResize() {
//         clearTimeout(this.resizeTimeout);
//         this.resizeTimeout = setTimeout(() => {
//             const width = Math.max(window.innerWidth, 1);
//             const height = Math.max(window.innerHeight, 1);

//             this.transitionCamera.aspect = width / height;
//             this.transitionCamera.updateProjectionMatrix();

//             if (this.currentTransition?.renderTarget) {
//                 this.currentTransition.renderTarget.setSize(width, height);
//             }
//         }, TransitionsManager.RESIZE_DEBOUNCE_TIME);
//     }

//     async createTransition(fromUrl, toUrl) {
//         if (this.currentTransition) {
//             this.currentTransition.dispose();
//         }

//         this.currentTransition = new TransitionInstance(
//             fromUrl,
//             toUrl,
//             this.mainRenderer,
//             this.composer,
//             this.textureLoader // Pasar el loader como parámetro
//         );

//         await this.currentTransition.initialize();
//         return this.currentTransition;
//     }

//     dispose() {
//         window.removeEventListener('resize', this.handleResize);
//         if (this.currentTransition) {
//             this.currentTransition.dispose();
//         }
//     }
// }

// class TransitionInstance {
//     // Modificar el constructor
//     constructor(fromUrl, toUrl, renderer, composer, textureLoader) {
//         this.fromUrl = fromUrl;
//         this.toUrl = toUrl;
//         this.renderer = renderer;
//         this.composer = composer;
//         this.textureLoader = textureLoader; // Recibir el loader
//         this.isTransitioning = false;
//         this.startTime = null;
//         this.progress = 0;
//         this.uniforms = {
//             texture1: { value: null },
//             texture2: { value: null },
//             progress: { value: 0 }
//         };

//         // En el constructor de TransitionInstance:
//         // this.material.uniforms.maxScale.value = 1.5;  // Escala máxima (1.0 = normal)
//         // this.material.uniforms.maxOffset.value = 0.2; // Desplazamiento máximo en UV coordinates
//         // this.material.uniforms.glitchIntensity.value = 0.7;

//         // Inicializar escena y cámara específicas para esta transición
//         this.transitionScene = new THREE.Scene();
//         this.transitionCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//         // this.createMesh();

//         this.initShaderMaterial();
//         this.createMesh(); // Ahora usa la nueva escena y geometría
//     }

//     initShaderMaterial() {
//         this.material = new THREE.ShaderMaterial({
//             uniforms: {
//                 texture1: { value: null },
//                 texture2: { value: null },
//                 progress: { value: 0 },
//                 time: { value: 0 },
//                 glitchIntensity: { value: 0.5 },
//                 rgbSplitIntensity: { value: 0.1 },
//                 maxScale: { value: 1.2 },  // Escala máxima permitida
//                 maxOffset: { value: 0.1 }   // Desplazamiento máximo
//             },
//             vertexShader: `
//                 varying vec2 vUv;
//                 void main() {
//                     vUv = uv;
//                     gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
//                 }
//             `,
//             fragmentShader: `
//                 uniform sampler2D texture1;
//                 uniform sampler2D texture2;
//                 uniform float progress;
//                 uniform float time;
//                 uniform float glitchIntensity;
//                 uniform float rgbSplitIntensity;
//                 uniform float maxScale;
//                 uniform float maxOffset;
//                 varying vec2 vUv;
                
//                 float rand(vec2 co) {
//                     return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
//                 }
                
//                 vec2 randomScale(vec2 uv, float seed) {
//                     // Generar escala aleatoria diferente para X/Y usando tiempo y seed único
//                     float scaleX = 1.0 + (rand(vec2(time * 0.1, seed)) * maxScale * progress;
//                     float scaleY = 1.0 + (rand(vec2(time * 0.1, seed + 1.0)) * maxScale * progress;
                    
//                     // Escalar desde el centro
//                     vec2 centeredUV = (uv - 0.5) * vec2(1.0/scaleX, 1.0/scaleY) + 0.5;
//                     return centeredUV;
//                 }
                
//                 vec2 randomOffset(vec2 uv, float seed) {
//                     // Generar offset aleatorio usando tiempo y seed único
//                     float offsetX = (rand(vec2(time * 0.2, seed)) * maxOffset * progress;
//                     float offsetY = (rand(vec2(time * 0.2, seed + 1.0)) * maxOffset * progress;
//                     return uv + vec2(offsetX, offsetY);
//                 }
                
//                 vec4 applyTextureEffects(sampler2D tex, vec2 uv, float seed) {
//                     // Aplicar transformaciones independientes a cada textura
//                     vec2 scaledUV = randomScale(uv, seed);
//                     vec2 offsetUV = randomOffset(scaledUV, seed + 2.0);
                    
//                     // Muestrear la textura con las coordenadas modificadas
//                     return texture2D(tex, offsetUV);
//                 }
                
//                 void main() {
//                     // Efectos independientes para cada textura usando diferentes seeds
//                     vec4 color1 = applyTextureEffects(texture1, vUv, 1.0);
//                     vec4 color2 = applyTextureEffects(texture2, vUv, 100.0);
                    
//                     // Efecto de separación RGB
//                     vec4 rgbSplit = vec4(
//                         texture2D(texture2, vUv + vec2(rgbSplitIntensity * progress, 0.0)).r,
//                         texture2D(texture2, vUv + vec2(-rgbSplitIntensity * progress * 0.5, 0.0)).g,
//                         texture2D(texture2, vUv + vec2(0.0, rgbSplitIntensity * progress)).b,
//                         mix(color1.a, color2.a, smoothstep(0.0, 1.0, progress))
//                     );
                    
//                     // Mezcla base con efectos
//                     vec4 finalColor = mix(color1, rgbSplit, smoothstep(0.0, 1.0, progress));
                    
//                     // Efectos adicionales de glitch
//                     float twitchIntensity = glitchIntensity * progress;
//                     vec2 glitchUV = vUv;
//                     glitchUV.x += (rand(vec2(time * 0.3, vUv.y)) * twitchIntensity;
//                     glitchUV.y += (rand(vec2(time * 0.3, vUv.x)) - 0.5) * twitchIntensity * 0.5;
                    
//                     // Aplicar distorsión final
//                     finalColor = mix(finalColor, texture2D(texture2, glitchUV), progress);
                    
//                     gl_FragColor = finalColor;
//                 }
//             `,
//             transparent: true
//         });
//     }

//     createMesh() {
//         // Crear geometría propia para esta instancia
//         this.geometry = new THREE.PlaneGeometry(2, 2);

//         this.mesh = new THREE.Mesh(this.geometry, this.material);
//         this.mesh.frustumCulled = false;
//         this.mesh.renderOrder = 999;

//         // Agregar el mesh a la escena de transición
//         this.transitionScene.add(this.mesh);
//     }

//     async initialize() {
//         try {
//             [this.uniforms.texture1.value, this.uniforms.texture2.value] = await Promise.all([
//                 this.loadTexture(this.fromUrl),
//                 this.loadTexture(this.toUrl)
//             ]);

//             this.createTransitionPass();
//         } catch (error) {
//             console.error('Texture loading failed:', error);
//             this.dispose();
//             throw error;
//         }
//     }

//     loadTexture(url) {
//         return new Promise((resolve, reject) => {
//             this.textureLoader.load(
//                 url,
//                 resolve,
//                 undefined,
//                 () => reject(new Error(`Failed to load texture: ${url}`))
//             );
//         });
//     }

//     createTransitionPass() {
//         this.transitionPass = new ShaderPass({
//             uniforms: {
//                 tDiffuse: { value: null },
//                 transitionTexture: { value: null }
//             },
//             vertexShader: `
//                             varying vec2 vUv;
//                             void main() {
//                                 vUv = uv;
//                                 gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
//                             }
//                         `,
//             fragmentShader: `
//                             uniform sampler2D tDiffuse;
//                             uniform sampler2D transitionTexture;
//                             varying vec2 vUv;
                            
//                             void main() {
//                                 vec4 sceneColor = texture2D(tDiffuse, vUv);
//                                 vec4 transitionColor = texture2D(transitionTexture, vUv);
//                                 gl_FragColor = mix(sceneColor, transitionColor, transitionColor.a);
//                             }
//                         `
//         });

//         this.transitionFilmPass = new FilmPass(1)
//         this.transitionGlitchPass = new GlitchPass(500)

//         this.composer.addPass(this.transitionPass);
//         this.composer.addPass(this.transitionFilmPass);
//         this.composer.addPass(this.transitionGlitchPass);
//     }
//     // En la clase TransitionInstance
//     startTransition(duration = TransitionsManager.DEFAULT_TRANSITION_DURATION) {
//         if (this.isTransitioning) return;

//         this.isTransitioning = true;
//         this.duration = duration; // Almacenar en la instancia
//         this.startTime = performance.now();
//         this.updateTransition();
//     }

//     updateTransition = () => {
//         if (!this.isTransitioning) return;

//         const elapsed = performance.now() - this.startTime;
//         this.progress = Math.min(elapsed / this.duration, 1); // Usar this.duration

//         this.uniforms.progress.value = this.progress;
//         this.renderTransition();

//         if (this.progress < 1) {
//             requestAnimationFrame(this.updateTransition);
//         } else {
//             this.completeTransition();
//         }
//     }
//     // En TransitionInstance.js, modifica el método renderTransition:
//     renderTransition() {
//         // Configurar render target con las dimensiones actuales
//         const width = this.renderer.domElement.width;
//         const height = this.renderer.domElement.height;

//         if (!this.renderTarget || this.renderTarget.width !== width || this.renderTarget.height !== height) {
//             if (this.renderTarget) this.renderTarget.dispose();
//             this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
//                 minFilter: THREE.LinearFilter,
//                 magFilter: THREE.LinearFilter
//             });
//         }

//         // Renderizar la escena de transición
//         this.renderer.setRenderTarget(this.renderTarget);
//         this.renderer.render(this.transitionScene, this.transitionCamera);
//         this.renderer.setRenderTarget(null);

//         // Actualizar textura del shader pass
//         this.transitionPass.uniforms.transitionTexture.value = this.renderTarget.texture;
//     }

//     completeTransition() {
//         this.isTransitioning = false;
//         this.progress = 0;
//         this.uniforms.progress.value = 0;
//         this.composer.removePass(this.transitionPass);
//         this.composer.removePass(this.transitionFilmPass);
//         this.composer.removePass(this.transitionGlitchPass);
//     }

//     dispose() {
//         this.material.dispose();
//         this.uniforms.texture1.value?.dispose();
//         this.uniforms.texture2.value?.dispose();
//         this.composer.removePass(this.transitionPass);
//         this.composer.removePass(this.transitionFilmPass);
//         this.composer.removePass(this.transitionGlitchPass);
//     }
// }