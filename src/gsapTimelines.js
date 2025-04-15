import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";


gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const gsapTimelines = () => {
    console.log("gsapTimelines")
    gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

    let xTo = gsap.quickTo(".cursor", "x", { duration: 0.5, ease: "power4" }),
        yTo = gsap.quickTo(".cursor", "y", { duration: 0.5, ease: "power4" });

    window.addEventListener("mousemove", e => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    let heroSecTl = gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
            trigger: '.spider-sticky',
            pin: true,
            start: 'top top', // when the top of the trigger hits the top of the viewport
            end: 'bottom top', // end after scrolling 500px beyond the start
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            markers: true,
            refreshPriority: 2
        }
    });

    heroSecTl.addLabel('intro')
        .from('.spider-sticky', { backgroundImage: "linear-gradient(#AB074F, #8F1E73)", duration: 10 }, 0)
        .to('.cursor-feedback', {autoAlpha: 1}, 0 )
        .to('.cursor-feedback', {autoAlpha: 0}, 5 )
        
        //copy-1
        .fromTo('.copy-1', { autoAlpha: 0, y: "60vh" }, { autoAlpha: 1, y: 0},  0)
        .to({}, {duration: 5})
        .to('.copy-1', { autoAlpha: 0, y: "-10vh" })

        .fromTo('.copy-2', { autoAlpha: 0, y: "60vh" }, { autoAlpha: 1, y: 0}, ">-0.5" )
        .to({}, {duration: 5})
        .to('.copy-2', { autoAlpha: 0, y: "-10vh" } )
        
        .fromTo('.copy-3', { autoAlpha: 0, y: "60vh" }, { autoAlpha: 1, y: 0}, ">-0.5" )
        .to({}, {duration: 5})
        .to('.copy-3', { autoAlpha: 0, y: "-10vh" } )
        
        .set('.div-text.hero-head_eyebrow', { y: "50vh", autoAlpha: 0 })
        .to('.div-text.hero-head_eyebrow', { autoAlpha: 1, delay: 5 })
        .to('.div-text.hero-head_eyebrow', { y: 0 } )

        .from('.div-keyword', { autoAlpha: 0 })
        .to('.div-keyword', { autoAlpha: 1, stagger: 0.2 })
        .from('.spider-texture-wrap', { opacity: 0 })
        .from('.spider-heading', { opacity: 0 })
        
        .from('.hero_spline', { opacity: 0 })
        .from('.main-text', { opacity: 0 })
        .to({}, {duration: 10})
        
        .addLabel('end');


}
