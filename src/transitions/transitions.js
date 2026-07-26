import { gsap } from "gsap";

export const pixelTransition = (trigger, transition) => {
    let pixelTransitions = trigger;
    gsap.set(".pixel-block:not(.pixel-spider", { autoAlpha: 0 })
    gsap.set(".pixel-spider", { autoAlpha: 0})

    pixelTransitions.forEach((container) => {
        let tl = gsap.timeline({
            paused: true,
            repeat: 1,
            repeatDelay: 1,
            yoyo: true,
            defaults: {
                ease: "sine.out",
            },
            onComplete: () => {gsap.set(".pixel-transition", {autoAlpha: 0})},
        });
        tl.addLabel("in")
        .set(".pixel-block:not(.pixel-spider)", { autoAlpha: 0 })
        .set(".pixel-spider", { autoAlpha: 0})
        .to(".pixel-block:not(.pixel-spider", {
            duration: 0.01,
            stagger: {
                from: "random",
                each: 0.002
            },
            autoAlpha: 1,
            repeatRefresh: true,
        })
        .to(".pixel-spider", {
            duration: 0.01,
            delay: 1,
            stagger: {
                from: "center",
                each: 0.004,
            },
            ease: "expo.out",
            autoAlpha: 1,
        })

        // document.addEventListener('click', )

        tl.play();
    })
    

}