import * as THREE from 'three';
import { loadTexture, loadMaterial } from './transitions'
import { transitionFragmentShader, transitionVertexShader } from '../shaders/transitionsShaders';

export class Transitions {
    constructor(fromImageUrl, toImageUrl) {
        this.fromImageUrl = fromImageUrl
        this.toImageUrl = toImageUrl

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(
            -1, 1, 1, -1, 0, 1
        );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }



    async loadTexture() {
        this.fromTexture = loadTexture(this.fromImageUrl)
        this.toTexture = loadTexture(this.toImageUrl)
    }

    async loadMaterial() {
        this.fromMaterial = loadMaterial(this.fromTexture)
        this.toMaterial = loadMaterial(this.toTexture)
    }

    async shaderMaterial() {
        // Crear geometría para cubrir toda la pantalla
        const geometry = new THREE.PlaneGeometry(2, 2);

        // Material personalizado para la transición
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                texture1: { value: null },
                texture2: { value: null },
                progress: { value: 0.0 }
            },
            vertexShader: transitionVertexShader,
            fragmentShader: transitionFragmentShader
        });

        // Crear malla
        this.screenQuad = new THREE.Mesh(geometry, this.shaderMaterial);


        return screenQuad
    }

    async addScreenQuad() {
        this.scene.add(this.screenQuad);
    }

    async initShaderMateial() {
        this.shaderMaterial.uniforms.texture1.value = this.fromTexture;
        this.shaderMaterial.uniforms.texture2.value = this.toTexture;
    }

    async animateTransition() {
        let startTime = Date.now();
        const duration = 3000; // 3 segundos

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1.0);

            this.shaderMaterial.uniforms.progress.value = progress;
            renderer.render(scene, camera);

            if (progress < 1.0) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }
}


// Configuración inicial




// URLs de las imágenes desde CDN (ejemplo)
// const textureUrls = [
//     'https://example-cdn.com/image1.jpg',
//     'https://example-cdn.com/image2.jpg'
// ];



// // Cargar texturas
// const loader = new THREE.TextureLoader();
// loader.crossOrigin = 'anonymous'; // Necesario para CDN

// Promise.all([
//     new Promise((resolve) => loader.load(textureUrls[0], resolve)),
//     new Promise((resolve) => loader.load(textureUrls[1], resolve))
// ]).then(([texture1, texture2]) => {
//     // Asignar texturas al material


//     // Iniciar animación
//     animateTransition();
// });

// Animación de transición


// // Manejar redimensionado de ventana
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });