import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from 'split-type';
import { TextScrambleAnimation } from "./textScrambleAnimation";
import { splineGlitchEffect } from "./splineGlitchEffect";

gsap.config({ force3D: false })
gsap.registerPlugin(ScrollTrigger, TextPlugin);


export const chapter1 = () => {
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
            
            // Initialize glitch effect after titleOut
            .call(async () => {
                await splineGlitchEffect.init();
                await splineGlitchEffect.start();
            }, null, 'titleOut')
            
            // Animate glitch parameters with scroll-reactive values
            .to({}, {
                duration: 5,
                onUpdate: function() {
                    const progress = this.progress();
                    const scrollProgress = ScrollTrigger.getById(timeline.scrollTrigger.id)?.progress || 0;
                    
                    // RGB Shift - peaks in the middle of the effect
                    const rgbShift = Math.sin(progress * Math.PI) * 15 * (1 + scrollProgress);
                    
                    // Glitch Intensity - builds up and fades
                    const glitchIntensity = Math.sin(progress * Math.PI) * 0.8;
                    
                    // Lateral Distortion - maximum disruption
                    const lateralDistortion = Math.sin(progress * Math.PI * 2) * 2.5 * (1 + scrollProgress * 2);
                    
                    // Digital Noise - random spikes
                    const digitalNoise = Math.random() > 0.7 ? Math.random() * 0.6 : Math.sin(progress * Math.PI) * 0.3;
                    
                    // Color Distortion - builds up gradually
                    const colorDistortion = progress * 0.7;
                    
                    // Scanlines - constant but varies with scroll
                    const scanLines = 0.2 + scrollProgress * 0.3;
                    
                    // Pixelation - intermittent
                    const pixelation = Math.random() > 0.8 ? Math.random() * 0.1 : 0;
                    
                    splineGlitchEffect.updateEffect({
                        rgbShift,
                        glitchIntensity,
                        lateralDistortion,
                        digitalNoise,
                        colorDistortion,
                        scanLines,
                        pixelation
                    });
                }
            }, 'titleOut+=0.2')
            
            // Stop glitch effect after 5 seconds
            .call(() => {
                splineGlitchEffect.stop();
                console.log('Glitch effect stopped');
            }, null, 'titleOut+=5.2')
            
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
      
      // Blur effect animation for each chapter section
      $(".chapter-section").each(function(sectionIndex) {
        const $section = $(this);
        
        $section.find(".svg_blureffect").each(function (index) {
          const $svgEffect = $(this);
          const uniqueId = `rgb-reveal-effect-${sectionIndex}-${index}`;
          
          $svgEffect.parent().attr("style", `filter: url(#${uniqueId});`);
          $svgEffect.find("filter").attr("id", uniqueId);
          
          // Get the matrix element within this specific SVG
          let matrix = $svgEffect.find('feColorMatrix')[0];
          if (!matrix) return; // Skip if no matrix found
          
          // Parse initial matrix values
          let initialValues = matrix.getAttribute('values').trim().split(/\s+/).map(Number);
        
          // Define the target values (e.g. normal/identity matrix)
          let targetValues = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
          ];
          
          // Create animation timeline
          let blurTl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: $section[0],
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
              onEnter: () => {
                console.log(`Blur animation triggered for section ${sectionIndex}`);
              },
              onLeave: () => {
                console.log(`Blur animation reversed for section ${sectionIndex}`);
              },
              onEnterBack: () => {
                console.log(`Blur animation re-triggered for section ${sectionIndex}`);
              }
            }
          });
          
          // Reset animation values for consistent replay
          let animVals = { vals: [...initialValues] };
          
          // Set initial blur state
          gsap.set($svgEffect.find("[stdDeviation]"), {attr: {stdDeviation: 13}});
          gsap.set($svgEffect.find("[dx]"), {attr: {dx: 5}});
          matrix.setAttribute("values", initialValues.map(v => v.toFixed(3)).join(' '));
          
          // Animation sequence
          blurTl.to($svgEffect.find("[stdDeviation]"), {
            attr: {stdDeviation: 0}, 
            duration: 0.7
          })
          .to($svgEffect.find("[dx]"), {
            attr: {dx: 0}
          }, "<")
          .to(animVals.vals, {
            endArray: targetValues,
            duration: 0.6,
            onUpdate: () => {
              matrix.setAttribute("values", animVals.vals.map(v => v.toFixed(3)).join(' '));
            }
          }, '<+0.4');
        });
      });

}
