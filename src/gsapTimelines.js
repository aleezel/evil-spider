import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from 'split-type';
import { TextScrambleAnimation } from "./textScrambleAnimation";

gsap.config({ force3D: false })
gsap.registerPlugin(ScrollTrigger, TextPlugin);


export const gsapTimelines = () => {
    // window.addEventListener('load', () => {
    //     ScrollTrigger.refresh(true);
    // })

    const kwords = document.querySelectorAll(".div-keyword");



    // // console.log("gsapTimelines")
    //cursor
    gsap.set(".cursor", { xPercent: -50, yPercent: -50 });
    gsap.set(".cursor-feedback", { autoAlpha: 0 });

    let xTo = gsap.quickTo(".cursor", "x", { duration: 0.5, ease: "back(1.2)" }),
        yTo = gsap.quickTo(".cursor", "y", { duration: 0.5, ease: "back(1.2)" });

    window.addEventListener("mousemove", e => {
        xTo(e.clientX);
        yTo(e.clientY);
    }, { passive: true });



    // Seleccionamos todos los textos secuenciales y palabras clave
    const introTexts = gsap.utils.toArray(".div-introtext")
    // Aseguramos que todos los textos inicien invisibles y sin desplazamiento
    gsap.set(introTexts, {
        xPercent: -50, // centrado horizontal
        yPercent: 150,  // empiezan desde abajo
        autoAlpha: 0   // incluye opacity y visibility: hidden
    })
    gsap.set(".div-introtext.text-1", { xPercent: -50 })

    const eyebrow = document.querySelector(".div-text.hero-head_eyebrow");
    // gsap.set('.div-text.hero-head_eyebrow', { y: "50vh", autoAlpha: 0 })
    gsap.set(eyebrow, { yPercent: 60, autoAlpha: 0 });


    let heroSecTl = gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
            trigger: '.spider-sticky',
            pin: true,
            start: 'top top', // when the top of the trigger hits the top of the viewport
            end: '+=5000', // end after scrolling 500px beyond the start
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            markers: true,
            refreshPriority: 2,
            //invalidateOnRefresh: true, // Add this to recalculate on resize
        }
    });

    heroSecTl.addLabel('intro')
        .from('.spider-sticky', { backgroundImage: "linear-gradient(#AB074F, #8F1E73)", duration: 10 }, 0)
        .to('.cursor-feedback', { autoAlpha: 1 }, 0)
        .to('.cursor-feedback', { autoAlpha: 0 }, 5)

    // Animaciones secuenciales: entrada → centro → salida
    introTexts.forEach((textEl, i) => {
        heroSecTl
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

    heroSecTl
        .to(eyebrow, { y: 0, autoAlpha: 1, duration: 1 }, ">-0.5")
        .to(eyebrow, { y: "-20svh", duration: 1 })

        .from('.div-keyword', { autoAlpha: 0 }, ">-0.5")
        .to(kwords, { autoAlpha: 1, stagger: { each: 0.2, from: "random" } })
        .from('.spider-heading', { opacity: 0 })

        .from('.hero_spline', { autoAlpha: 0 })
        .from('.spider-texture-wrap', { opacity: 0, duration: 2 }, ">-0.5")
        .from('.main-text', { opacity: 0 }, ">-2")
        .from('.color-overlay', { opacity: 0, duration: 6 }, 12)

        .addLabel('end');


}
