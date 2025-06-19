import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from 'split-type';
import { TextScrambleAnimation } from "./textScrambleAnimation";

gsap.config({ force3D: false })
gsap.registerPlugin(ScrollTrigger, TextPlugin);


export const chapter1 = () => {
    document.addEventListener("DOMContentLoaded", (event) => {
        gsap.registerPlugin(ScrollTrigger)

        //Intro text
        const introChap1Texts = gsap.utils.toArray(".chapter1-intro")
        gsap.set(introChap1Texts, {
            xPercent: -50, // centrado horizontal
            yPercent: 150,  // empiezan desde abajo
            autoAlpha: 0   // incluye opacity y visibility: hidden
        })

        //Main Baby text split
        let flyingTextSplit = new SplitType("[flying-text]", { types: "chars" })
        
         gsap.set(flyingTextSplit.chars, { y: '50svh' })
         gsap.set('.head-chars-wrap', { rotation: 70, yPercent: 80 })
      
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.text-scroll-section', // We pin this section
          start: 'center center',
          end: '+=2600', // how long to pin (play with this)
          scrub: 2,
          pin: true, // Pin it using GSAP, no CSS sticky needed
          //markers: true
        }
      });
      
        // Animaciones secuenciales: entrada → centro → salida
    introChap1Texts.forEach((textEl, i) => {
        timeline
            .to(textEl, {
                yPercent: -50, // llega al centro vertical
                autoAlpha: 1,
                duration: 1.5,
                onStart: (nodeElement) => {
                    console.log(nodeElement)
                    const textElement = nodeElement?.querySelector("h4")
                    if (textElement) {
                        console.log(textElement)
                        TextScrambleAnimation(textElement)
                    }
                },
                onStartParams: [textEl]

            }, i * 2)
            .to(textEl, {
                yPercent: -250, // sale hacia arriba
                autoAlpha: 0,
                duration: 1.5
            }, (i * 2) + 2.5) // espera 1s visible en centro antes de salir
    })
        timeline.to('.head-chars-wrap', { rotation: 0, ease: 'back', duration: 10, yPercent: 0 }, 0)
            .to('.head-chars-wrap', { rotation: 0, ease: 'back', duration: 10, yPercent: 0 }, 0)
            .to(flyingTextSplit.chars, { y: '0svh', ease: 'back', duration: 12, stagger: 0.4 }, "<+=1")
            .add('titleOut')
        //.to(flyingTextSplit.chars, { y: '-12svh', ease: 'expoScale(0.5,7,power2.out)', duration: 12, stagger:{each: 0.4, from: "end"} }, 'titleOut')
         //.to('.head-chars-wrap', { rotation: -5, opacity: 0, ease: 'expoScale(0.5,7,power2.out)', duration: 10 }, 'titleOut')
      
      
        console.log(flyingTextSplit.chars)
        
       gsap.to("[data-speed]", {
        y: (i, el) => (1 - parseFloat(el.getAttribute("data-speed"))) * ScrollTrigger.maxScroll(window) ,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          invalidateOnRefresh: true,
          scrub: 1
        }
      });
      
      $(".svg_blureffect").each(function (index) {
          $(this).parent().attr("style", "filter: url(#rgb-reveal-effect-" + index +");");
        $(this).find("filter").attr("id", "rgb-reveal-effect-" + index);
        let matrix = document.querySelector('feColorMatrix');
        // Parse initial matrix values
        let initialValues = matrix.getAttribute('values').trim().split(/\s+/).map(Number);
      
        // Define the target values (e.g. blueish tint)
        let targetValues = [
          1, 0, 0, 0, 0,
          0, 1, 0, 0, 0,
          0, 0, 1, 0, 0,
          0, 0, 0, 1, 0
        ];
        
        let animVals = { vals: [...initialValues] };
      
        let blurTl = gsap.timeline({
            defaults: { ease:"power2.out"}
        });
        
        blurTl.fromTo($(this).find("[stdDeviation]"),
            {attr: {stdDeviation: 13} },
            {attr: {stdDeviation: 0, duration: 0.7} }
        );
        blurTl.to($(this).find("[dx]"), {attr: {dx: 0} }, "<"  );
        blurTl.to(animVals.vals, {
          endArray: targetValues,
          onUpdate: () => {
            matrix.setAttribute("values", animVals.vals.map(v => v.toFixed(3)).join(' '));
          }
        }, '<+0.4');
      
      });
      
      
      
      
        
      });
      
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
         * Add a placeholder while waiting for Spline to load
         */
       /* addPlaceholder(container) {
          const placeholder = document.createElement('div');
          placeholder.className = 'spline-placeholder';
          placeholder.innerHTML = '<div class="spline-loading">3D content will load when visible</div>';
          
          // Add styling to the placeholder
          if (!document.querySelector('#spline-placeholder-styles')) {
            const style = document.createElement('style');
            style.id = 'spline-placeholder-styles';
            style.textContent = `
              .spline-placeholder {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.1);
                z-index: 1;
              }
              .spline-loading {
                padding: 10px 20px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border-radius: 4px;
                font-family: sans-serif;
                font-size: 14px;
              }
            `;
            document.head.appendChild(style);
          }
          
          // Add placeholder to container
          container.style.position = 'relative';
          container.appendChild(placeholder);
        }*/
      
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
      
      // Initialize when DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        // Small delay to make sure all elements are properly available
        setTimeout(() => splineLazyLoader.init(), 100);
      });
      
      // Re-initialize on page load
      window.addEventListener('load', () => {
        splineLazyLoader.init();
      });
      
      // Handle page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          // Page is visible again - reinitialize
          splineLazyLoader.init();
        }
      });

}
