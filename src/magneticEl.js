import {gsap} from "gsap";
import { SplitText } from "gsap/SplitText"; 

export const MagneticElements = () => {
    const zones = document.querySelectorAll('.mag-zone');
    zones.forEach((zone) => {
        var sm = 0.4;
        var md = 0.45;
        var lg = 0.5;

        var magSm = zone.querySelector('.mag-sm');
        var magMd = zone.querySelector('.mag-md');
        var magLg = zone.querySelector('.mag-lg');

        zone.addEventListener('mousemove', (e) => {
            const rect = zone.getBoundingClientRect();
            const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width /2, rect.width /2, e.clientX);
            const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

            gsap.to(magSm, {
                x: x * sm,
                y: y* sm,
                duration: 0.4,
                ease:'power2.out',
                overwrite: true
            });
            gsap.to(magMd, {
                x: x * md,
                y: y * md,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: true
            })
            gsap.to(magLg, {
                x: x * lg,
                y: y * lg,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: true
            });
        })

        zone.addEventListener('mouseleave', (e) => {

            gsap.to(magSm, {
                x: 0,
                y: 0,
                duration: 0.9,
                ease: 'elasctic.out(1.4, 0.75)',
                overwrite: true
            });
            gsap.to(magMd, {
                x: 0,
                y: 0,
                duration: 0.9,
                ease: 'elasctic.out(1.4, 0.75)',
                overwrite: true
            })
            gsap.to(magLg, {
                x: 0,
                y: 0,
                duration: 0.9,
                ease: 'elasctic.out(1.4, 0.75)',
                overwrite: true
            });
        });
    })
}