export const TextScrambleAnimation = (textBox) => {
    // Elementos y configuración
    // const textBox = $(text_id);
    console.log(textBox)
    textBox = $(textBox);
    const specialCharacters = [
        '!', '§', '$', '%', '&', '/', '(', ')', '=', '?',
        '_', '<', '>', '^', '°', '*', '#', '-', ':', ';', '~'
    ];

    // Configuración de la animación
    const animationSpeed = 100; // Velocidad en milisegundos (antes era 125)
    const revealDelay = 0;     // Retraso antes de revelar caracteres

    // Función para generar números aleatorios en un rango
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    /**
     * Inicia la animación de "scramble" (texto mezclado)
     * Esta función toma el texto original y lo reemplaza gradualmente
     * mostrando primero caracteres aleatorios que se van reemplazando
     * con los caracteres originales uno por uno
     */
    function startScrambleText() {
        // Divide el texto en un array de caracteres
        const originalChars = textBox.text().split('');

        // Configura la animación CSS para el contenedor de texto
        textBox.css({
            'width': originalChars.length + 'ch',
            'animation': 'typing ' + ((animationSpeed * originalChars.length) / 1000) +
                's steps(' + originalChars.length + ')'
        });

        // Variables para controlar el progreso de la animación
        let count = 0;          // Contador de ciclos completados
        let revealedChars = 0;  // Número de caracteres ya revelados

        // Configura el intervalo de actualización para la animación
        const animationInterval = setInterval(function () {
            let displayText = "";
            let index = 0; // sirve para llevar conteo de las letras
            const reveler = Number((originalChars.length + revealDelay) / 4)

            // Genera el texto a mostrar en cada ciclo usando for...of
            for (const originalChar of originalChars) {
                // Si el carácter debe ser revelado, muestra el original
                const reveler = Number((originalChars.length + revealDelay) / 4)
                if (index <= revealedChars && count >= reveler) {
                    displayText += originalChar;
                } else {
                    // Sino, muestra un carácter aleatorio
                    const randomIndex = getRandomNumber(0, specialCharacters.length);
                    displayText += specialCharacters[randomIndex];
                }
                index++;
            }

            // Actualiza el texto en la página
            textBox.text(`${displayText.slice(0, count)}|`);

            // Incrementa el contador de ciclos
            count++;

            // Verifica si es momento de revelar otro carácter
            if (count >= reveler) {
                revealedChars++;

                // Si todos los caracteres han sido revelados, detiene la animación
                if (revealedChars >= originalChars.length) {
                    clearInterval(animationInterval);
                }
            }
        }, animationSpeed);
    }

    // Inicia la animación cuando la página está lista
    startScrambleText();
}
