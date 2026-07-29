import { gsap } from "gsap";

export const pixelTransition = (link, transition) => {

    gsap.set(".pixel-block:not(.pixel-spider)", { autoAlpha: 0 });
    gsap.set(".pixel-spider", { autoAlpha: 0 });
    gsap.set(transition, { autoAlpha: 1 });

    /* function navigate(link) {
        window.location.href = link.getAttribute("href");
    } */

    let tl = gsap.timeline({
        /* paused: true, */
        repeat: 1,
        repeatDelay: 1,
        yoyo: true,
        defaults: {
            ease: "sine.out",
        },
        onComplete: () => {
            gsap.set(transition, { autoAlpha: 0 });
            console.log("Transition complete");
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
    /* .call(navigate(link)) */
    .to(".pixel-spider", {
        duration: 0.01,
        delay: 1,
        stagger: {
            from: "center",
            each: 0.004,
        },
        ease: "expo.out",
        autoAlpha: 1,
    });
    /* debugger; */
        
    if(link) {
        tl.play();
    }
    
}