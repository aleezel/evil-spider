import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";


gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const gsapTimelines = () => {
    console.log("gsapTimelines")
    gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

    let xTo = gsap.quickTo(".cursor", "x", { duration: 0.3, ease: "power4.out" }),
        yTo = gsap.quickTo(".cursor", "y", { duration: 0.3, ease: "power4.out" });

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
            markers: true
        }
    });

    heroSecTl.addLabel('intro')
        // .from('.spider-sticky', { backgroundImage: "linear-gradient(#AB074F, #8F1E73)", duration: 10 }, 0)
        .from('.copy-1', { opacity: 0, y: "60vh" }, 0)
        .to('.copy-1', { opacity: 1, y: "-10vh" }, 0.5)
        .from('.copy-2', { opacity: 0, y: "60vh" }, "<1")
        .from('.copy-3', { opacity: 0, y: "60vh" })
        .from('.hero-keyword', { opacity: 0 })
        .from('.hero-head_eyebrow', { opacity: 0 })
        .from('.spider-heading', { opacity: 0 })
        .from('.hero_spline', { opacity: 0 })
        .from('.main-text', { opacity: 0 })
        .from('.spider-texture-wrap', { opacity: 0 })
        .addLabel('end');


}
