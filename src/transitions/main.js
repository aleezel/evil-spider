import * as THREE from 'three';
// Agrega la importación faltante en TransitionsManager.js
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export class TransitionsManager {
    static DEFAULT_TRANSITION_DURATION = 3000;
    static RESIZE_DEBOUNCE_TIME = 100;

    constructor(mainRenderer, composer) {
        this.mainRenderer = mainRenderer;
        this.composer = composer;
        this.textureLoader = new THREE.TextureLoader(); // Mover aquí el inicializador
        this.isTransitioning = false;
        this.resizeTimeout = null;
        this.currentTransition = null;

        this.initTransitionScene();
        this.setupEventListeners();
    }


    initTransitionScene() {
        this.transitionScene = new THREE.Scene();
        this.transitionCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.geometry = new THREE.PlaneGeometry(2, 2);
        // this.textureLoader = new THREE.TextureLoader();
    }

    setupEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    // En TransitionsManager.js:
    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            const width = Math.max(window.innerWidth, 1);
            const height = Math.max(window.innerHeight, 1);

            this.transitionCamera.aspect = width / height;
            this.transitionCamera.updateProjectionMatrix();

            if (this.currentTransition?.renderTarget) {
                this.currentTransition.renderTarget.setSize(width, height);
            }
        }, TransitionsManager.RESIZE_DEBOUNCE_TIME);
    }

    async createTransition(fromUrl, toUrl) {
        if (this.currentTransition) {
            this.currentTransition.dispose();
        }

        this.currentTransition = new TransitionInstance(
            fromUrl,
            toUrl,
            this.mainRenderer,
            this.composer,
            this.textureLoader // Pasar el loader como parámetro
        );

        await this.currentTransition.initialize();
        return this.currentTransition;
    }

    dispose() {
        window.removeEventListener('resize', this.handleResize);
        if (this.currentTransition) {
            this.currentTransition.dispose();
        }
    }
}

class TransitionInstance {
    // Modificar el constructor
    constructor(fromUrl, toUrl, renderer, composer, textureLoader) {
        this.fromUrl = fromUrl;
        this.toUrl = toUrl;
        this.renderer = renderer;
        this.composer = composer;
        this.textureLoader = textureLoader; // Recibir el loader
        this.isTransitioning = false;
        this.startTime = null;
        this.progress = 0;
        this.uniforms = {
            texture1: { value: null },
            texture2: { value: null },
            progress: { value: 0 }
        };

        this.initShaderMaterial();
        this.createMesh();

        // Inicializar escena y cámara específicas para esta transición
        this.transitionScene = new THREE.Scene();
        this.transitionCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.initShaderMaterial();
        this.createMesh(); // Ahora usa la nueva escena y geometría
    }

    initShaderMaterial() {
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform float progress;
        varying vec2 vUv;
        
        void main() {
          vec4 color1 = texture2D(texture1, vUv);
          vec4 color2 = texture2D(texture2, vUv);
          gl_FragColor = mix(color1, color2, smoothstep(0.0, 1.0, progress));
        }
      `,
            transparent: true
        });
    }

    createMesh() {
        // Crear geometría propia para esta instancia
        this.geometry = new THREE.PlaneGeometry(2, 2);

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.mesh.renderOrder = 999;

        // Agregar el mesh a la escena de transición
        this.transitionScene.add(this.mesh);
    }

    async initialize() {
        try {
            [this.uniforms.texture1.value, this.uniforms.texture2.value] = await Promise.all([
                this.loadTexture(this.fromUrl),
                this.loadTexture(this.toUrl)
            ]);

            this.createTransitionPass();
        } catch (error) {
            console.error('Texture loading failed:', error);
            this.dispose();
            throw error;
        }
    }

    loadTexture(url) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                resolve,
                undefined,
                () => reject(new Error(`Failed to load texture: ${url}`))
            );
        });
    }

    createTransitionPass() {
        this.transitionPass = new ShaderPass({
            uniforms: {
                tDiffuse: { value: null },
                transitionTexture: { value: null }
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D transitionTexture;
        varying vec2 vUv;
        
        void main() {
          vec4 sceneColor = texture2D(tDiffuse, vUv);
          vec4 transitionColor = texture2D(transitionTexture, vUv);
          gl_FragColor = mix(sceneColor, transitionColor, transitionColor.a);
        }
      `
        });

        this.composer.addPass(this.transitionPass);
    }
    // En la clase TransitionInstance
    startTransition(duration = TransitionsManager.DEFAULT_TRANSITION_DURATION) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.duration = duration; // Almacenar en la instancia
        this.startTime = performance.now();
        this.updateTransition();
    }

    updateTransition = () => {
        if (!this.isTransitioning) return;

        const elapsed = performance.now() - this.startTime;
        this.progress = Math.min(elapsed / this.duration, 1); // Usar this.duration

        this.uniforms.progress.value = this.progress;
        this.renderTransition();

        if (this.progress < 1) {
            requestAnimationFrame(this.updateTransition);
        } else {
            this.completeTransition();
        }
    }
    // En TransitionInstance.js, modifica el método renderTransition:
    renderTransition() {
        // Configurar render target con las dimensiones actuales
        const width = this.renderer.domElement.width;
        const height = this.renderer.domElement.height;

        if (!this.renderTarget || this.renderTarget.width !== width || this.renderTarget.height !== height) {
            if (this.renderTarget) this.renderTarget.dispose();
            this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter
            });
        }

        // Renderizar la escena de transición
        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.render(this.transitionScene, this.transitionCamera);
        this.renderer.setRenderTarget(null);

        // Actualizar textura del shader pass
        this.transitionPass.uniforms.transitionTexture.value = this.renderTarget.texture;
    }

    completeTransition() {
        this.isTransitioning = false;
        this.progress = 0;
        this.uniforms.progress.value = 0;
        this.composer.removePass(this.transitionPass);
    }

    dispose() {
        this.material.dispose();
        this.uniforms.texture1.value?.dispose();
        this.uniforms.texture2.value?.dispose();
        this.composer.removePass(this.transitionPass);
    }
}