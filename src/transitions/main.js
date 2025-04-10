import * as THREE from 'three';

export class Transitions {
    constructor(fromImageUrl, toImageUrl, mainRenderer) {
        this.fromImageUrl = fromImageUrl;
        this.toImageUrl = toImageUrl;
        this.mainRenderer = mainRenderer;

        // Configurar escena de transición
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Crear geometría una sola vez
        this.geometry = new THREE.PlaneGeometry(2, 2);

        // Texturas y materiales
        this.textureLoader = new THREE.TextureLoader();
        this.isTransitioning = false;
    }

    async init() {
        // Cargar texturas
        this.fromTexture = await this.loadTexture(this.fromImageUrl);
        this.toTexture = await this.loadTexture(this.toImageUrl);

        // Crear material de transición
        this.createShaderMaterial();

        // Crear y añadir malla
        this.screenQuad = new THREE.Mesh(this.geometry, this.shaderMaterial);
        this.scene.add(this.screenQuad);
    }

    loadTexture(url) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                resolve,
                undefined,
                reject
            );
        });
    }

    createShaderMaterial() {
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                texture1: { value: this.fromTexture },
                texture2: { value: this.toTexture },
                progress: { value: 0.0 }
            },
            vertexShader: transitionVertexShader,
            fragmentShader: transitionFragmentShader,
            transparent: true
        });
    }

    startTransition(duration = 3000) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        const startTime = Date.now();

        const update = () => {
            if (!this.isTransitioning) return;

            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1.0);

            this.shaderMaterial.uniforms.progress.value = progress;

            if (progress < 1.0) {
                requestAnimationFrame(update);
            } else {
                this.isTransitioning = false;
            }
        };

        requestAnimationFrame(update);
    }

    getTransitionPass() {
        return new ShaderPass({
            uniforms: {
                tDiffuse: { value: null },
                transitionTexture: { value: this.mainRenderer.domElement.texture }
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
                    vec4 mainScene = texture2D(tDiffuse, vUv);
                    vec4 transition = texture2D(transitionTexture, vUv);
                    gl_FragColor = mix(mainScene, transition, transition.a);
                }
            `
        });
    }
}