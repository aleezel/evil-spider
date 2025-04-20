import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const gsapTimelines = () => {
    // Configuración inicial del cursor
    const cursorSetup = () => {
        gsap.set(".cursor", { xPercent: -50, yPercent: -50 });
        gsap.set(".cursor-feedback", { autoAlpha: 0 });

        const xTo = gsap.quickTo(".cursor", "x", { duration: 0.5, ease: "back(1.2)" });
        const yTo = gsap.quickTo(".cursor", "y", { duration: 0.5, ease: "back(1.2)" });

        window.addEventListener("mousemove", (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        }, { passive: true });
    };

    // Animación principal de la sección hero
    const setupHeroAnimations = () => {
        const introTexts = gsap.utils.toArray(".div-introtext");
        const kwords = document.querySelectorAll(".div-keyword");

        // Configuración inicial
        gsap.set([introTexts, '.div-keyword'], { autoAlpha: 0 });
        gsap.set(introTexts, {
            xPercent: -50,
            yPercent: 60,
            transformStyle: "preserve-3d"
        });

        // Timeline principal
        const heroTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.spider-sticky',
                start: 'top top',
                end: '+=3000',
                scrub: 1,
                pin: true,
                markers: false,
                anticipatePin: 1
            }
        });

        // Animación de textos introductorios
        introTexts.forEach((text, index) => {
            heroTimeline
                .fromTo(text,
                    { yPercent: 60, autoAlpha: 0 },
                    {
                        yPercent: -50,
                        autoAlpha: 1,
                        duration: 1.5,
                        ease: "power2.out"
                    },
                    index * 3
                )
                .to(text, {
                    yPercent: -160,
                    autoAlpha: 0,
                    duration: 1.5,
                    ease: "power2.in",
                    overwrite: true
                }, `+=1`);
        });

        // Animación final de elementos
        heroTimeline
            .fromTo('.div-text.hero-head_eyebrow',
                { y: "50vh", autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 2,
                    ease: "elastic.out(1, 0.5)"
                },
                "-=2"
            )
            .fromTo(kwords,
                { autoAlpha: 0, y: 50 },
                {
                    autoAlpha: 1,
                    y: 0,
                    stagger: {
                        each: 0.2,
                        from: "center",
                        grid: "auto"
                    },
                    duration: 1.5,
                    ease: "back.out(1.2)"
                },
                "<+=0.5"
            )
            .fromTo('.spider-texture-wrap',
                { opacity: 0 },
                { opacity: 1, duration: 1 },
                "<"
            );

        return heroTimeline;
    };

    // Inicialización de animaciones
    cursorSetup();
    setupHeroAnimations();
};