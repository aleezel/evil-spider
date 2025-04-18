export const TextScrambleAnimation = (originalTextBox) => {
    // Elementos y configuración

    let textBox = $(originalTextBox)//.children('h4.first');
    const specialCharacters = [
        // Símbolos comunes
        '!', '@', '#', '$', '%', '&', '*', '+', '-', '=', '?',
        '/', '~', '^',

        // Letras mayúsculas y minúsculas
        'A', 'b', 'C', 'd', 'E', 'f', 'G', 'h', 'I', 'j',
        'K', 'l', 'M', 'n', 'O', 'p', 'Q', 'r', 'S', 't',
        'U', 'v', 'W', 'x', 'Y', 'z',

        // Caracteres chinos y japoneses (ejemplos, pueden ampliarse)
        '日', '本', '中', '国', '学', '生',

        // Otros caracteres especiales
        '{', '}', '[', ']', '<', '>', '¿', '¡'
    ];


    // Configuración de la animación
    const originalChars = textBox.text().replace('|', '').split('');
    const animationSpeed = 100 + 0.5 * originalChars.length; // Velocidad en milisegundos (antes era 125)

    // Función para generar números aleatorios en un rango
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    /**
     * Inicia la animación de "scramble" (texto mezclado)
     * Esta función toma el texto original y lo reemplaza gradualmente
     * mostrando primero caracteres aleatorios que se van reemplazando
     * con los caracteres originales uno por uno
     */
    function startScrambleText() {
        // const originalChars = textBox.text().replace('|', '').split('');
        textBox.css({
            // 'width': originalChars.length + 'ch',
            'animation': 'typing ' + ((animationSpeed * originalChars.length) / 1000) +
                's steps(' + originalChars.length + ')'
        });

        // Variables para controlar el progreso de la animación
        let totalRevChars = 0;          // Contador de ciclos completados
        let originalRevChars = 0;  // Número de caracteres ya revelados
        // Configura el intervalo de actualización para la animación
        let reveler = Math.round(Number((originalChars.length) / 4))
        const animationInterval = setInterval(function () {
            let displayText = "";
            let originalCharIndex = 0; // sirve para llevar conteo de las letras
            // Genera el texto a mostrar en cada ciclo usando for...of
            for (const originalChar of originalChars) {
                // Si el carácter debe ser revelado, muestra el original
                if (originalCharIndex <= originalRevChars) {
                    displayText += originalChar;
                } else {
                    // Sino, muestra un carácter aleatorio
                    const randomoriginalCharIndex = getRandomNumber(0, specialCharacters.length);
                    displayText += specialCharacters[randomoriginalCharIndex];
                }
                originalCharIndex++;
            }

            // Actualiza el texto en la página
            textBox.text(`${displayText.slice(0, totalRevChars)}|`);

            // Incrementa el contador de ciclos
            totalRevChars++;

            if (textBox.css('visibility') === 'hidden') {
                textBox.css('visibility', 'visible');
            }

            // Verifica si es momento de revelar otro carácter
            if (totalRevChars >= reveler) {
                originalRevChars++;

                // Si todos los caracteres han sido revelados, detiene la animación
                if (originalRevChars >= originalChars.length) {
                    textBox.text(`${textBox.text()}`);
                    clearInterval(animationInterval);
                }
            }
        }, animationSpeed);
    }

    // Inicia la animación cuando la página está lista
    startScrambleText();
}
