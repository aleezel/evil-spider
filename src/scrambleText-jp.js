import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
  gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

export const scrambleTextJp = () => {
    
    const scrambleTexts = document.querySelectorAll('[data-scrambletextauto]');
    let tl = gsap.timeline();

    scrambleTexts.forEach((text, i) => {
        let ogText = text.innerText;
        let attribute = text.getAttribute('data-scrambletextauto');
        text.innerText = '';

        tl.to(text, {
            scrambleText: {
                text: ogText,
                chars: '人 類 !  社 会のすべ ての構成員の?固有の $ 尊厳と平等で譲ることのできない権利とを承認する¿ことは',
                revealDelay: (attribute == 'intro') ? 3.5 : 0,
                speed: 0.6,
                oldClass:'dotgothic16-regular japanScramble',
                delimiter: (i == 1) ? '' : '',
                
            },
            duration: gsap.utils.clamp(3, ogText.length * 0.6, 7) ,
            // duration: 10,
            // delay: 6,
            ease: 'none',
        })

    });
}