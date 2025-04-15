import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";


gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const gsapTimelines = () => {
    console.log("gsapTimelines")
    gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

    let xTo = gsap.quickTo(".cursor", "x", { duration: 0.3, ease: "expo.out" }),
        yTo = gsap.quickTo(".cursor", "y", { duration: 0.3, ease: "expo.out" });

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
            refreshPriority: -1
        }
    });

    heroSecTl.addLabel('intro')
        .from('.spider-sticky', { backgroundImage: "linear-gradient(#AB074F, #8F1E73)", duration: 10 }, 0)
        .fromTo('.copy-1', { autoAlpha: 0, y: "60vh" }, { autoAlpha: 1}, duration: 8, 0)
        .to('.copy-1', { delay: 10, autoAlpha: 0, y: "-10vh" }, ">10")
        .fromTo('.copy-2', { autoAlpha: 0, y: "60vh" }, { autoAlpha: 1, duration: 8}, ">-0.5" )
        .to('.copy-2', { delay: 10, autoAlpha: 0, y: "-10vh" }, ">10")
        .fromTo('.copy-3', { autoAlpha: 0, y: "60vh" }, { autoAlpha: 1, duration: 8}, ">-0.5" )
        .to('.copy-3', { delay: 10, autoAlpha: 0, y: "-10vh" }, ">10")
        .from('.hero-head_eyebrow', { autoAlpha: 0 })
        .to('.hero-head_eyebrow', { autoAlpha: 1, y: "50vh" }, ">2")

        .from('.div-keyword', { autoAlpha: 0, stagger: 0.2 })
        
        .from('.spider-heading', { opacity: 0 })
        .from('.spider-texture-wrap', { opacity: 0 })
        .from('.hero_spline', { opacity: 0 })
        .from('.main-text', { opacity: 0 })
        .to({}, {duration: 5})
        
        .addLabel('end');


}
