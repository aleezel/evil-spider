import { gsap } from "gsap";

export const pixelTransition = () => {
    let pixelTransitions = gsap.utils.toArray(".pixel-transition");
    gsap.set(".pixel-block:not(.pixel-spider", { autoAlpha: 0 })
    gsap.set(".pixel-spider", { autoAlpha: 0})

    pixelTransitions.forEach((container) => {
        let tl = gsap.timeline({
            defaults: {
                ease: "sine.out"
            }
        });
        tl.addLabel("in")
        .to(".pixel-block:not(.pixel-spider", {
            duration: 0.01,
            stagger: {
                from: "random",
                each: 0.002
            },
            autoAlpha: 1,
        })
        .to(".pixel-spider", {
            duration: 0.01,
            delay: 0.3,
            stagger: {
                from: "center",
                each: 0.004,
            },
            autoAlpha: 1,
        }) 
    })
    

}