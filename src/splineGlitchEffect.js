import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GlitchRGBShader } from "./shaders/glitchRGBShader.js";
import html2canvas from 'html2canvas';

export class SplineGlitchEffect {
    constructor() {
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.composer = null;
        this.glitchPass = null;
        this.canvas = null;
        this.isActive = false;
        this.animationId = null;
        this.startTime = 0;
        this.texture = null;
        this.material = null;
        this.originalBodyOverflow = null;
        this.mesh = null;
    }

    async init() {
        console.log('Inicializando efecto glitch...');
        
        // Create full-screen overlay canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '10000';
        this.canvas.style.opacity = '0';
        this.canvas.style.backgroundColor = 'transparent';
        document.body.appendChild(this.canvas);

        // Set up WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true
        });

        // Create scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Create a plane geometry that covers the screen
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        // Create texture that will hold the captured content
        this.texture = new THREE.Texture();
        this.texture.format = THREE.RGBAFormat;
        this.texture.type = THREE.UnsignedByteType;
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.wrapS = THREE.ClampToEdgeWrapping;
        this.texture.wrapT = THREE.ClampToEdgeWrapping;
        this.texture.flipY = false;
        
        // Create material that will display the captured content
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: false
        });
        
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        // Set up post-processing with our custom shader
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        
        // Add glitch pass
        this.glitchPass = new ShaderPass(GlitchRGBShader);
        this.composer.addPass(this.glitchPass);

        // Initial uniform values
        this.glitchPass.uniforms.rgbShift.value = 0;
        this.glitchPass.uniforms.glitchIntensity.value = 0;
        this.glitchPass.uniforms.digitalNoise.value = 0;
        this.glitchPass.uniforms.scanLines.value = 0;
        this.glitchPass.uniforms.colorDistortion.value = 0;
        this.glitchPass.uniforms.lateralDistortion.value = 0;
        this.glitchPass.uniforms.pixelation.value = 0;

        this.setupResize();
        this.onResize();
        
        console.log('Efecto glitch inicializado correctamente');
    }

    async captureViewport() {
        console.log('Capturando viewport con html2canvas...');
        
        try {
            // Hide our canvas temporarily to avoid capturing it
            this.canvas.style.display = 'none';
            
            // Use html2canvas to render the document body
            const canvasElement = await html2canvas(document.body, {
                allowTaint: true,
                useCORS: true,
                logging: false,
                width: window.innerWidth,
                height: window.innerHeight,
                scrollX: 0,
                scrollY: 0,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                backgroundColor: null,
                removeContainer: true,
                foreignObjectRendering: true,
                scale: 1,
                onclone: (clonedDoc) => {
                    // Remove any existing glitch canvases from the clone
                    const glitchCanvases = clonedDoc.querySelectorAll('canvas[style*="z-index: 10000"]');
                    glitchCanvases.forEach(canvas => canvas.remove());
                    
                    // Ensure Spline elements are visible in the clone
                    const splineElements = clonedDoc.querySelectorAll('spline-viewer');
                    splineElements.forEach(el => {
                        el.style.visibility = 'visible';
                        el.style.opacity = '1';
                    });
                }
            });
            
            // Show our canvas again
            this.canvas.style.display = 'block';
            
            // Update the texture with the captured canvas
            this.texture.image = canvasElement;
            this.texture.needsUpdate = true;
            
            console.log('Viewport capturado exitosamente');
            return true;
            
        } catch (error) {
            console.error('Error capturando viewport:', error);
            
            // Show our canvas again in case of error
            this.canvas.style.display = 'block';
            
            // Fallback to alternative method
            return this.alternativeCaptureMethod();
        }
    }

    alternativeCaptureMethod() {
        console.log('Usando método de captura alternativo...');
        
        // Create a fallback canvas with current viewport dimensions
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = window.innerWidth;
        fallbackCanvas.height = window.innerHeight;
        
        const ctx = fallbackCanvas.getContext('2d');
        
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, fallbackCanvas.width, fallbackCanvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);
        
        // Add some visual noise
        const imageData = ctx.getImageData(0, 0, fallbackCanvas.width, fallbackCanvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() > 0.98) {
                const noise = Math.random() * 50;
                data[i] += noise;     // R
                data[i + 1] += noise; // G
                data[i + 2] += noise; // B
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Add some text overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GLITCH EFFECT ACTIVE', fallbackCanvas.width / 2, fallbackCanvas.height / 2);
        
        // Update texture
        this.texture.image = fallbackCanvas;
        this.texture.needsUpdate = true;
        
        console.log('Método alternativo completado');
        return true;
    }

    setupResize() {
        window.addEventListener('resize', () => this.onResize(), { passive: true });
    }

    onResize() {
        if (!this.renderer || !this.composer) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }

    async start() {
        if (this.isActive) return;
        
        console.log('Iniciando efecto glitch...');
        
        // Capture the current viewport
        const captureSuccess = await this.captureViewport();
        
        if (!captureSuccess) {
            console.error('Error al capturar viewport');
            return;
        }
        
        // Store original body overflow
        this.originalBodyOverflow = document.body.style.overflow;
        
        // Hide original content with smooth transition
        document.body.style.transition = 'opacity 0.3s ease-out';
        document.body.style.opacity = '0';
        
        // Wait a bit then show the distorted version
        setTimeout(() => {
            this.canvas.style.transition = 'opacity 0.3s ease-in';
            this.canvas.style.opacity = '1';
        }, 300);
        
        this.isActive = true;
        this.startTime = Date.now();
        this.animate();
        
        console.log('Efecto glitch iniciado');
    }

    stop() {
        if (!this.isActive) return;
        
        console.log('Deteniendo efecto glitch...');
        
        this.isActive = false;
        
        // Hide distorted version
        this.canvas.style.transition = 'opacity 0.3s ease-out';
        this.canvas.style.opacity = '0';
        
        // Show original content
        document.body.style.transition = 'opacity 0.3s ease-in';
        document.body.style.opacity = '1';
        
        // Restore original overflow
        if (this.originalBodyOverflow !== null) {
            document.body.style.overflow = this.originalBodyOverflow;
        }
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        console.log('Efecto glitch detenido');
    }

    animate() {
        if (!this.isActive) return;

        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Update time uniform
        const currentTime = (Date.now() - this.startTime) * 0.001;
        if (this.glitchPass && this.glitchPass.uniforms.time) {
            this.glitchPass.uniforms.time.value = currentTime;
        }
        
        this.composer.render();
    }

    // Update effect parameters
    updateEffect(params) {
        if (!this.glitchPass) return;

        const uniforms = this.glitchPass.uniforms;
        
        if (params.rgbShift !== undefined) uniforms.rgbShift.value = params.rgbShift;
        if (params.glitchIntensity !== undefined) uniforms.glitchIntensity.value = params.glitchIntensity;
        if (params.digitalNoise !== undefined) uniforms.digitalNoise.value = params.digitalNoise;
        if (params.scanLines !== undefined) uniforms.scanLines.value = params.scanLines;
        if (params.colorDistortion !== undefined) uniforms.colorDistortion.value = params.colorDistortion;
        if (params.lateralDistortion !== undefined) uniforms.lateralDistortion.value = params.lateralDistortion;
        if (params.pixelation !== undefined) uniforms.pixelation.value = params.pixelation;
    }

    // Clean up resources
    dispose() {
        console.log('Limpiando recursos del efecto glitch...');
        
        this.stop();
        
        // Restore original content visibility
        document.body.style.opacity = '1';
        if (this.originalBodyOverflow !== null) {
            document.body.style.overflow = this.originalBodyOverflow;
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        if (this.texture) {
            this.texture.dispose();
        }
        
        if (this.material) {
            this.material.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.composer) {
            this.composer.dispose();
        }
        
        console.log('Recursos limpiados');
    }
}

// Export singleton instance
export const splineGlitchEffect = new SplineGlitchEffect(); 