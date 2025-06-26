import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GlitchRGBShader } from "./shaders/glitchRGBShader.js";

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
    }

    init() {
        // Create overlay canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        this.canvas.style.mixBlendMode = 'screen'; // Blend mode for overlay effect
        this.canvas.style.opacity = '0';
        document.body.appendChild(this.canvas);

        // Set up WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
        });

        // Create scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Create a plane geometry that covers the screen
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        // Create material with a simple texture (we'll use the screen content)
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        // Set up post-processing
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

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.startTime = Date.now();
        this.canvas.style.opacity = '1';
        this.animate();
    }

    stop() {
        this.isActive = false;
        this.canvas.style.opacity = '0';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
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
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
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