// HTML elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Game settings
const boardSize = 10;
let initialGameSpeed = 200;  // Velocidad inicial (más lenta)
let speedIncrement = 10;     // Aumento de velocidad en cada incremento
const maxGameSpeed = 50;     // Velocidad máxima (muy rápida)
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

// Game Variables   
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;
let gameSpeed;  // La velocidad actual del juego

// Variables para el mouse
let lastMousePosition = { x: 0, y: 0 };
let currentMousePosition = { x: 0, y: 0 };

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

// Rellena cada cuadrado del tablero 
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        const index = emptySquares.indexOf(square);
        if (index !== -1) {
            emptySquares.splice(index, 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction]).padStart(2, '0');
    const [row, column] = newSquare.split('');

    if (newSquare < 0 ||
        newSquare > boardSize * boardSize ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFood = () => {
    score++;
    updateScore();
    createRandonFood();
    increaseSpeed();  // Aumentar la velocidad cada vez que coma
}

const gameOver = () => {
    gameOverSign.style.display = 'flex';
    clearInterval(moveInterval);
    startButton.disabled = false;
    document.removeEventListener('mousemove', handleMouseMove);  // Removemos el evento del mouse al final del juego
}

const setDirection = newDirection => {
    direction = newDirection;
}

const handleMouseMove = (event) => {
    currentMousePosition = { x: event.clientX, y: event.clientY };

    const deltaX = currentMousePosition.x - lastMousePosition.x;
    const deltaY = currentMousePosition.y - lastMousePosition.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            // Movimiento hacia la derecha
            direction !== 'ArrowLeft' && setDirection('ArrowRight');
        } else {
            // Movimiento hacia la izquierda
            direction !== 'ArrowRight' && setDirection('ArrowLeft');
        }
    } else {
        if (deltaY > 0) {
            // Movimiento hacia abajo
            direction !== 'ArrowUp' && setDirection('ArrowDown');
        } else {
            // Movimiento hacia arriba
            direction !== 'ArrowDown' && setDirection('ArrowUp');
        }
    }

    lastMousePosition = { ...currentMousePosition };
}

const createRandonFood = () => {
    const randomEmptySquares = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquares, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnndex) => {
            const squareValue = `${rowIndex}${columnndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    });
}

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    board.innerHTML = '';
    emptySquares = [];
    gameSpeed = initialGameSpeed;  // Iniciar con la velocidad inicial
    createBoard();
}

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandonFood();
    document.addEventListener('mousemove', handleMouseMove);  // Agregar evento del mouse
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
}

// Función para incrementar la velocidad del juego
const increaseSpeed = () => {
    if (gameSpeed > maxGameSpeed) {  // Limitar la velocidad máxima
        gameSpeed -= speedIncrement;  // Aumentar la velocidad (reducir el intervalo)
        clearInterval(moveInterval);  // Limpiar el intervalo actual
        moveInterval = setInterval(() => moveSnake(), gameSpeed);  // Iniciar el nuevo intervalo con la velocidad incrementada
    }
}

startButton.addEventListener('click', startGame);
