import { gsap } from "gsap";
import { gsapTimelines } from "../gsapTimelines";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const pixelTransition = (link, transition, ) => {

    gsap.set(".pixel-block:not(.pixel-spider)", { autoAlpha: 0 });
    gsap.set(".pixel-spider", { autoAlpha: 0 });
    gsap.set(transition, { autoAlpha: 1 });
    

    function navigate(link) {
        window.location.href = link.getAttribute("href");
    }

    let tl = gsap.timeline({
        paused: true,
        repeat: 1,
        repeatDelay: 1,
        yoyo: true,
        defaults: {
            ease: "sine.out",
        },
        onComplete: () => {
            gsap.set([transition, "#home"], { autoAlpha: 0, display: "none" });
            document.body.classList.remove("no-scroll")
            
            // gsap.set(link, { autoAlpha: 0 });
        },
    });


    tl.to(".pixel-block:not(.pixel-spider)", {
        duration: 0.01,
        stagger: {
            from: "random",
            each: 0.002,
        },
        autoAlpha: 1,
        repeatRefresh: true,
    })
    .to(".pixel-spider", {
        duration: 0.01,
        delay: 0.5,
        stagger: {
            from: "center",
            each: 0.004,
        },
        ease: "expo.out",
        autoAlpha: 1,
        onComplete: () => {
            gsap.set("#home", { display: "none" })
            gsapTimelines.heroSecTl?.ScrollTrigger?.refresh()
            ScrollTrigger.refresh()  
        },
    })
    .call(navigate, [link])
    /* debugger; */
        
    if(link) {
        tl.play();
    }
    
}