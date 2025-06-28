import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GlitchRGBShader } from "./shaders/glitchRGBShader.js";
import { html2canvas } from 'html2canvas';

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
        this.captureCanvas = null;
        this.texture = null;
        this.material = null;
        this.originalBodyOverflow = null;
    }

    async init() {
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
        document.body.appendChild(this.canvas);

        // Set up WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true
        });

        // Create scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Create a plane geometry that covers the screen
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        // Create texture from captured content
        this.texture = new THREE.Texture();
        this.texture.format = THREE.RGBAFormat;
        this.texture.type = THREE.UnsignedByteType;
        
        // Create material that will display the captured content
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: false
        });
        
        const mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(mesh);

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
    }

    async captureViewport() {
        // Create a temporary canvas to capture the current viewport
        const captureCanvas = document.createElement('canvas');
        const captureCtx = captureCanvas.getContext('2d');
        
        captureCanvas.width = window.innerWidth;
        captureCanvas.height = window.innerHeight;
        
        // Use html2canvas to capture the current page content
        try {
            const html2canvas = await import('html2canvas');
            const canvas = await html2canvas.default(document.body, {
                width: window.innerWidth,
                height: window.innerHeight,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                ignoreElements: (element) => {
                    // Ignore our own canvas
                    return element === this.canvas;
                }
            });
            
            // Update the texture with the captured content
            this.texture.image = canvas;
            this.texture.needsUpdate = true;
            
            return true;
        } catch (error) {
            console.warn('html2canvas not available, using alternative capture method');
            return this.alternativeCaptureMethod();
        }
    }

    alternativeCaptureMethod() {
        // Fallback: create a simple representation
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const ctx = canvas.getContext('2d');
        
        // Fill with a gradient or pattern as fallback
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#2a2a2a');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add some text elements as visual reference
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GLITCH EFFECT ACTIVE', canvas.width / 2, canvas.height / 2);
        
        this.texture.image = canvas;
        this.texture.needsUpdate = true;
        
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
        
        console.log('Starting glitch effect...');
        
        // Capture the current viewport
        await this.captureViewport();
        
        // Store original body overflow to restore later
        this.originalBodyOverflow = document.body.style.overflow;
        
        // Smooth transition to hide original content
        // but keep it in the DOM so Spline continues running
        document.body.style.transition = 'opacity 0.3s ease-out';
        document.body.style.opacity = '0';
        
        // Show our distorted version with transition
        this.canvas.style.transition = 'opacity 0.3s ease-in';
        this.canvas.style.opacity = '1';
        
        this.isActive = true;
        this.startTime = Date.now();
        this.animate();
        
        console.log('Glitch effect started');
    }

    stop() {
        if (!this.isActive) return;
        
        console.log('Stopping glitch effect...');
        
        this.isActive = false;
        
        // Hide the distorted version with transition
        this.canvas.style.transition = 'opacity 0.3s ease-out';
        this.canvas.style.opacity = '0';
        
        // Show the original content again with transition
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
        
        console.log('Glitch effect stopped');
    }

    animate() {
        if (!this.isActive) return;

        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Update time uniform
        const currentTime = (Date.now() - this.startTime) * 0.001;
        this.glitchPass.uniforms.time.value = currentTime;
        
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
    }
}

// Export singleton instance
export const splineGlitchEffect = new SplineGlitchEffect(); 