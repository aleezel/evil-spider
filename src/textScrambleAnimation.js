export const TextScrambleAnimation = (originalTextBox) => {
    // 1. Referencia al elemento y configuración inicial
    const $el = $(originalTextBox)
        .addClass('scramble-text');

    // Texto original dividido en caracteres
    const originalChars = $el.text().replace('|', '').split('');
    const length = originalChars.length;

    // Fijar width en ch para que siempre mida length caracteres
    $el.css('width', `${length}ch`);

    // Caracteres usados en el “ruido”
    const specialChars = [
        '!', '@', '#', '$', '%', '&', '*', '+', '-', '=', '?',
        '/', '~', '^', '日', '本', '中', '国', '学', '生', '{', '}', '[', ']', '<', '>', '¿', '¡'
    ];

    // Velocidad de la animación en ms
    const animationSpeed = 100 + 0.5 * length;
    const revealStep = Math.round(length / 4);

    // Generador de índice aleatorio
    const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    function startScramble() {
        let totalFrames = 0;  // total de iteraciones
        let revealedChars = 0;  // cuántos originales ya mostramos

        const intervalId = setInterval(() => {
            let displayText = '';

            // Construimos siempre un string de longitud “length”
            for (let i = 0; i < length; i++) {
                if (i <= revealedChars) {
                    // mostramos carácter original
                    displayText += originalChars[i];
                } else {
                    // [Opción A] ruido: carácter aleatorio
                    displayText += specialChars[rand(0, specialChars.length)];
                    // [Opción B] en lugar de ruido, podrían ser espacios:
                    // displayText += ' ';
                }
            }

            // Añadimos el cursor visible “|”
            $el.text(displayText + '|');

            totalFrames++;
            // cada revealStep iteraciones, aumentamos revealedChars
            if (totalFrames >= revealStep) {
                revealedChars++;
                totalFrames = 0;
            }
            // cuando ya revelamos todo, paramos
            if (revealedChars >= length) {
                clearInterval(intervalId);
                // dejamos sólo el texto final (sin cursor opcionalmente)
                $el.text(originalChars.join(''));
            }
        }, animationSpeed);
    }

    // Arrancamos al cargar
    startScramble();
};
