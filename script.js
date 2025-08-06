document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    // Guardamos en constantes las referencias a los elementos HTML con los que vamos a interactuar.

    // El h1 donde se muestra el número grande que ha salido.
    const numberDisplay = document.querySelector('.nbr-wrapper h1');
    // El contenedor (seguramente un <div> o <ul>) donde se mostrará la lista de números que ya han salido.
    const calledNumbersContainer = document.querySelector('.called-numbers-list');
    // El primer botón de los controles, para ir al número anterior.
    const prevButton = document.querySelector('.controls button:nth-child(1)');
    // El segundo botón, para reiniciar el juego.
    const resetButton = document.querySelector('.controls button:nth-child(2)');
    // El tercer botón, para sacar un nuevo número.
    const nextButton = document.querySelector('.controls button:nth-child(3)');

    // --- Estado de la Aplicación ---
    // Aquí guardamos los datos que necesita nuestra aplicación para funcionar.

    // Array con todos los números posibles del bingo (1 al 24). Se irán quitando a medida que salgan.
    let availableNumbers = Array.from({ length: 24 }, (_, i) => i + 1);
    // Array que almacenará en orden los números que ya han salido.
    let calledNumbers = [];
    // Variable para guardar el número que se está mostrando actualmente en el display grande.
    let currentNumber = null;
    // Índice para saber qué número del array `calledNumbers` estamos viendo (útil para los botones de anterior/siguiente).
    let actualIndex = -1;

    // --- Funciones Auxiliares (Helpers) ---

    /**
     * Actualiza el display principal que muestra el número grande.
     * @param {number | null} number - El número a mostrar. Si es null, muestra '00'.
     * @param {boolean} [animate=false] - Si es true, añade una animación CSS para el cambio.
     */
    const updateDisplay = (number, animate = false) => {
        // Si el número es null, muestra '00', de lo contrario, lo formatea a dos dígitos (ej: 7 -> '07').
        const newText = number ? number.toString().padStart(2, '0') : '00';

        if (animate) {
            numberDisplay.classList.add('pop-in-animation');
            // El evento 'animationend' se asegura de quitar la clase de animación cuando termina,
            // para que pueda volver a usarse en el siguiente número.
            numberDisplay.addEventListener('animationend', () => {
                numberDisplay.classList.remove('pop-in-animation');
            }, { once: true }); // 'once: true' hace que el listener se elimine solo después de ejecutarse.
        }

        numberDisplay.textContent = newText;
    };

    /**
     * Actualiza la lista visual de números que ya han salido.
     * Limpia el contenedor y vuelve a renderizar todos los números del array `calledNumbers`.
     */
    const updateCalledNumbersList = () => {
        calledNumbersContainer.innerHTML = ''; // Limpia la lista anterior para no duplicar.
        calledNumbers.forEach(num => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('called-number-item');
            numberElement.textContent = num.toString().padStart(2, '0');
            calledNumbersContainer.appendChild(numberElement);
        });
    };
    
    /**
     * Reinicia el juego a su estado inicial.
     * Restablece todas las variables de estado y actualiza la interfaz gráfica.
     */
    const resetGame = () => {
        availableNumbers = Array.from({ length: 24 }, (_, i) => i + 1);
        calledNumbers = [];
        currentNumber = null;
        actualIndex = -1;
        updateDisplay(currentNumber);
        updateCalledNumbersList();
        console.log('Juego reiniciado. Todos los números están disponibles de nuevo.');
    };

    /**
     * Habilita o deshabilita los botones de navegación según el estado del juego.
     * Mejora la experiencia de usuario al prevenir clics inútiles.
     */
    const updateButtonStates = () => {
        prevButton.disabled = actualIndex <= 0;
        nextButton.disabled = availableNumbers.length === 0 && actualIndex === calledNumbers.length - 1;
    };

    // --- Configuración Inicial ---
    // Al cargar la página, se llama a resetGame() para establecer el estado inicial
    // del juego y preparar la interfaz de usuario.
    resetGame();

    // --- Event Listeners (Manejadores de Eventos) ---
    // Aquí definimos qué funciones se ejecutarán cuando el usuario interactúe con los botones.

    /**
     * Evento de clic para el botón "Siguiente".
     * Saca un nuevo número si estamos al final de la lista, o navega hacia adelante
     * en el historial de números ya sacados.
     */
    nextButton.addEventListener('click', () => {
        // Si hemos usado el botón "anterior" y no estamos en el último número,
        // simplemente avanzamos en el historial de números ya sacados.
        if (actualIndex < calledNumbers.length - 1) {
            actualIndex++;
            currentNumber = calledNumbers[actualIndex];
            updateDisplay(currentNumber);
            updateButtonStates();
            return;
        }

        // Si no hay más números disponibles, no hacemos nada.
        if (availableNumbers.length === 0) {
            console.log('Todos los números ya han salido.');
            updateButtonStates();
            return;
        }

        // --- Lógica para sacar un número nuevo ---
        // 1. Obtenemos un índice aleatorio del array de números disponibles.
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);

        // 2. Usamos splice() para quitar el número del array de disponibles y guardarlo.
        const newNumber = availableNumbers.splice(randomIndex, 1)[0];

        // 3. Añadimos el nuevo número a nuestro historial de números sacados.
        calledNumbers.push(newNumber);

        // 4. Actualizamos las variables de estado.
        currentNumber = newNumber;
        actualIndex = calledNumbers.length - 1;

        // 5. Actualizamos la interfaz gráfica.
        updateDisplay(currentNumber, true); // Mostramos el número con animación.
        updateCalledNumbersList();
        updateButtonStates();
    });

    /**
     * Evento de clic para el botón "Anterior".
     * Permite navegar hacia atrás en el historial de números que ya han salido.
     */
    prevButton.addEventListener('click', () => {
        // Solo podemos retroceder si no estamos en el primer número del historial.
        if (actualIndex > 0) {
            actualIndex--;
            currentNumber = calledNumbers[actualIndex];
            updateDisplay(currentNumber);
            updateButtonStates();
        }
    });

    /**
     * Evento de clic para el botón "Reiniciar".
     * Llama a la función resetGame para empezar una nueva partida.
     */
    resetButton.addEventListener('click', () => {
        // Simplemente llamamos a la función que reinicia todo el estado.
        resetGame();
        updateButtonStates();
    });
});
