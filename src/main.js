import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsapTimelines } from "./gsapTimelines.js";
import { TextScrambleAnimation } from "./textScrambleAnimation.js";
import { chapter1 } from "./chapter-1.js";
import { Howl } from "howler";
import { testGlitchEffect } from "./debugGlitch.js"; // Debug utilities for development
import html2canvas from 'html2canvas';

// Inicialización del composer
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FishEyeShader } from "./shaders/fisheyeShader.js"

gsap.config({ force3D: false })

// index.js
// ---------
// 1) Captura todo sólo cuando el DOM esté listo
// window.Webflow && window.Webflow.push(function () {
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  
  //Avoid scrolltrigger hijacking by in
  window.addEventListener('load', () => {
      gsapTimelines();
      chapter1();
      // Re-initialize on page load
      splineLazyLoader.init();

    setTimeout(() => {
      ScrollTrigger.refresh();
  }, 100);
  })

  testGlitchEffect();
  
  // 2) Logger en pantalla (VITE env vars)
  const logContainer = document.createElement("div");
  Object.assign(logContainer.style, {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    maxHeight: "200px",
    overflowY: "auto",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    fontSize: "12px",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: "99999",
  });
  document.body.prepend(logContainer);

  const buildNumber = import.meta.env.VITE_BUILD_NUMBER || "N/A";
  const commitSHA = import.meta.env.VITE_COMMIT_SHA || "N/A";
  const startTime = import.meta.env.VITE_START_TIME || "N/A";

  const msg = document.createElement("div");
  msg.textContent = `
      Hora de inicio: ${startTime}
      Build Number: ${buildNumber}
      Commit SHA: ${commitSHA}
    `;
  logContainer.appendChild(msg);
  console.log(`
      Hora de inicio: ${startTime}
      Build Number: ${buildNumber}
      Commit SHA: ${commitSHA}
    `)

  // 3) Three.js + EffectComposer
  const canvas = document.querySelector("#effects");
  if (!canvas) {
    console.error("Canvas #effects no encontrado — verifique su HTML");
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 4;



  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const fishEyePass = new ShaderPass(FishEyeShader);
  fishEyePass.uniforms.strength.value = 0.3;
  composer.addPass(fishEyePass);

  // Función para tamaño correcto
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w === 0 || h === 0) return; // evita framebuffers de tamaño cero
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
    if(window.ScrollTrigger){
      ScrollTrigger.refresh();
    }
  }

  window.addEventListener("resize", onResize, { passive: true });
  onResize(); // llamada inicial

  // 4) Loop de animación
  function animate() {
    requestAnimationFrame(animate);
    composer.render();
  }
  animate(); // arranca el loop


  // 6) Text scramble con IntersectionObserver
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          TextScrambleAnimation(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.1 }
  );
  document
    .querySelectorAll("[terminal-text] h4")
    .forEach((el) => {
      const texto = el.textContent.trim().toLowerCase();
      if (texto.includes('heading')) {
        observer.observe(el);
      }
    });

  // 7) Gestión de audio con Howler
  const sound = new Howl({
    src: ["https://evilspider-webgl.alejandra-piedra.com/evil-spider.mp3"],
    volume: 0.1,
    onplayerror() {
      sound.once("unlock", () => sound.play());
    },
  });
  document.querySelectorAll(".main-btn, .sound-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      sound.playing() ? sound.pause() : sound.play()
    );
  });


  testGlitchEffect();

  /**
       * Spline Lazy Loader with Deactivation
       * - Lazily loads Spline embeds when they enter the viewport
       * - Deactivates Spline embeds when they go 1000px out of the viewport
       */
      
      // Configuration options
      const LOAD_THRESHOLD = 0.3;     // Load when 30% visible
      const UNLOAD_DISTANCE = 2000;   // Unload when 1000px away from viewport
      
      // Class to handle Spline lazy loading and unloading
      class SplineLazyLoader {
        constructor() {
          this.initialized = false;
          this.splineContainers = [];
          this.loadObserver = null;
          this.unloadObserver = null;
          this.activeSplines = new Map(); // Track active Spline instances
          this.originalContents = new Map(); // Store original HTML for restoration
        }
        
        /**
         * Initialize the lazy loader
         */
        init() {
          if (this.initialized) return;
          
          // Find all spline containers
          this.splineContainers = Array.from(document.querySelectorAll('[data-animation-type="spline"]'));
          
          if (this.splineContainers.length === 0) {
            console.log('No Spline containers found on page');
            return;
          }
          
          console.log(`Found ${this.splineContainers.length} Spline containers to manage`);
          
          // Setup IntersectionObservers
          this.setupLoadObserver();
          this.setupUnloadObserver();
          
          // Mark as initialized
          this.initialized = true;
        }
      
        /**
         * Set up the IntersectionObserver for loading
         */
        setupLoadObserver() {
          const options = {
            root: null, // Use viewport
            rootMargin: '0px',
            threshold: LOAD_THRESHOLD // 30% visibility threshold
          };
          
          this.loadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              const container = entry.target;
              
              if (entry.isIntersecting) {
                // Save original content if not already saved
                if (!this.originalContents.has(container) && container.innerHTML) {
                  this.originalContents.set(container, container.innerHTML);
                }
                
                // Load Spline if not already active
                if (!this.activeSplines.has(container)) {
                  this.loadSpline(container);
                }
              }
            });
          }, options);
          
          // Start observing each container for loading
          this.splineContainers.forEach(container => {
            // Add a placeholder or loading state if needed
            /*if (!container.querySelector('.spline-placeholder')) {
              this.addPlaceholder(container);
            }*/
            
            // Start observing
            this.loadObserver.observe(container);
          });
        }
        
        /**
         * Set up the IntersectionObserver for unloading with extended rootMargin
         */
        setupUnloadObserver() {
          const margin = UNLOAD_DISTANCE;
          const options = {
            root: null,
            // Extend the detection area by UNLOAD_DISTANCE pixels in all directions
            rootMargin: `-${margin}px -${margin}px -${margin}px -${margin}px`,
            threshold: 0 // Any visibility
          };
          
          this.unloadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              const container = entry.target;
              
              if (!entry.isIntersecting && this.activeSplines.has(container)) {
                // Element is not in extended viewport, unload it
                console.log('Unloading Spline from out-of-view container', container);
                this.unloadSpline(container);
              } else if (entry.isIntersecting && !this.activeSplines.has(container)) {
                // Element is back in extended viewport
                // We'll let the load observer handle re-activation
              }
            });
          }, options);
          
          // Start observing each container for unloading
          this.splineContainers.forEach(container => {
            this.unloadObserver.observe(container);
          });
        }
      
        /**
         * Load the Spline script and initialize the Spline viewer
         */
        loadSpline(container) {
          console.log('Loading Spline for', container);
          
          // Update placeholder message
          const placeholder = container.querySelector('.spline-placeholder');
          /*if (placeholder) {
            placeholder.innerHTML = '<div class="spline-loading">Loading 3D content...</div>';
          }*/
          
          // Mark as loading
          this.activeSplines.set(container, 'loading');
          
          // Check if Spline script is already loaded
          if (!window.spline && !document.querySelector('script[src*="spline-viewer.js"]')) {
            // If script is already loaded, just initialize the scene
            if (window.spline) {
              this.initializeSplineScene(container);
            } else {
              // Wait for script to be ready
              const checkSpline = setInterval(() => {
                if (window.spline) {
                  clearInterval(checkSpline);
                  this.initializeSplineScene(container);
                }
              }, 100);
            }
          }
        }
      
        /**
         * Initialize the Spline scene in the container
         */
        initializeSplineScene(container) {
          // Get the Spline URL from the container
          const splineUrl = container.getAttribute('data-spline-url');
          
          if (!splineUrl) {
            console.error('No Spline URL found for container', container);
            return;
          }
          
          try {
            // Create the spline viewer element
            const splineElement = document.createElement('spline-viewer');
            
            // Set attributes
            splineElement.setAttribute('url', splineUrl);
            splineElement.classList.add('spline-active-viewer');
            
            // Optional attributes
            if (container.hasAttribute('data-spline-loading')) {
              splineElement.setAttribute('loading', container.getAttribute('data-spline-loading'));
            }
            
            // Set up event listener for when Spline is loaded
            splineElement.addEventListener('load', () => {
              console.log('Spline loaded successfully:', splineUrl);
              
              // Update active status to 'loaded'
              this.activeSplines.set(container, 'loaded');
              
              // Remove placeholder when loaded
              const placeholder = container.querySelector('.spline-placeholder');
              if (placeholder) {
                placeholder.remove();
              }
            });
            
            // Clear the container (except placeholder) and add the spline element
            container.querySelectorAll(':not(.spline-placeholder)').forEach(el => el.remove());
            container.appendChild(splineElement);
            
          } catch (error) {
            console.error('Error initializing Spline scene:', error);
            
            // Show error in placeholder
            const placeholder = container.querySelector('.spline-placeholder');
            if (placeholder) {
              placeholder.innerHTML = '<div class="spline-loading">Error loading 3D content</div>';
            }
            
            // Remove from active splines
            this.activeSplines.delete(container);
          }
        }
        
        /**
         * Unload the Spline instance and restore placeholder
         */
        unloadSpline(container) {
          // Only proceed if this container has an active Spline
          if (!this.activeSplines.has(container)) return;
          
          // Find and remove the spline viewer
          const splineElement = container.querySelector('spline-viewer');
          if (splineElement) {
            // Try to call any cleanup methods if they exist
            try {
              if (splineElement.application) {
                // Try to stop any animations or processes
                if (splineElement.application.stop) {
                  splineElement.application.stop();
                }
                
                // Explicitly dispose of WebGL context if possible
                if (splineElement.application.dispose) {
                  splineElement.application.dispose();
                }
              }
            } catch (e) {
              console.warn('Error during Spline cleanup:', e);
            }
            
            // Remove the element
            splineElement.remove();
          }
          
          // Restore original content or add placeholder
          if (this.originalContents.has(container)) {
            container.innerHTML = this.originalContents.get(container);
          } /*else {
            container.innerHTML = '';
            this.addPlaceholder(container);
          }*/
          
          // Update placeholder text if it exists
          const placeholder = container.querySelector('.spline-placeholder');
          /*if (placeholder) {
            placeholder.innerHTML = '<div class="spline-loading">3D content unloaded (will reload when visible)</div>';
          }*/
          
          // Remove from active splines
          this.activeSplines.delete(container);
          
          console.log('Spline unloaded from container to save resources');
        }
        
        /**
         * Cleanup all resources
         */
        dispose() {
          if (this.loadObserver) {
            this.loadObserver.disconnect();
          }
          
          if (this.unloadObserver) {
            this.unloadObserver.disconnect();
          }
          
          // Unload all active Splines
          this.activeSplines.forEach((status, container) => {
            this.unloadSpline(container);
          });
          
          this.activeSplines.clear();
          this.originalContents.clear();
          this.initialized = false;
        }
      }
  
      // Create the lazy loader
      const splineLazyLoader = new SplineLazyLoader();
      
      // Initialize when DOM is loaded -> moved to the top with the initial addEventListener('DOMContentLoaded'
      // Small delay to make sure all elements are properly available
      setTimeout(() => splineLazyLoader.init(), 100);

      // Handle page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          // Page is visible again - reinitialize
          splineLazyLoader.init();
        }
      });
      
      // Cleanup glitch effect on page unload
      window.addEventListener('beforeunload', () => {
        splineGlitchEffect.dispose();
      });

  
});
// });
