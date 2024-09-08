// HTML elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');
const userModal = document.getElementById('userModal');
const playerNameInput = document.getElementById('playerName');
const submitNameButton = document.getElementById('submitName');
const warning = document.getElementById('warning');
const gameOverInfo = document.getElementById('gameOverInfo');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restart');
const rulesAndControls = document.getElementById('rulesAndControls');
const continueButton = document.getElementById('continueButton');

// Game settings
const boardSize = 10;
let initialGameSpeed = 200;
let speedIncrement = 10;
const maxGameSpeed = 50;
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
let gameSpeed;
let playerName = '';
let controlMethod = 'keyboard'; // Default control method

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

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
    increaseSpeed();
}

const gameOver = () => {
    gameOverSign.style.display = 'none';
    gameOverInfo.style.display = 'flex';
    finalScore.innerText = `Game Over! ${playerName}, tu puntuación es ${score}`;
    clearInterval(moveInterval);
    startButton.disabled = false;

    // Guardar resultado en localStorage
    saveScore();
    document.removeEventListener('mousemove', handleMouseMove);
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
            direction !== 'ArrowLeft' && setDirection('ArrowRight');
        } else {
            direction !== 'ArrowRight' && setDirection('ArrowLeft');
        }
    } else {
        if (deltaY > 0) {
            direction !== 'ArrowUp' && setDirection('ArrowDown');
        } else {
            direction !== 'ArrowDown' && setDirection('ArrowUp');
        }
    }

    lastMousePosition = currentMousePosition;
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
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
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
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}

const startGame = () => {
    if (!playerName) {
        warning.innerText = 'Por favor, ingrese su nombre para continuar.';
        return;
    }

    userModal.style.display = 'none';
    rulesAndControls.style.display = 'flex';
}

const continueGame = () => {
    const controlMethodRadio = document.querySelector('input[name="controlMethod"]:checked');
    controlMethod = controlMethodRadio.value;

    rulesAndControls.style.display = 'none';
    startButton.style.display = 'block';
    setGame();
}

const startActualGame = () => {
    startButton.style.display = 'none';
    drawSnake();
    updateScore();
    createRandonFood();
    document.addEventListener('mousemove', handleMouseMove);
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
}

const saveScore = () => {
    const scores = JSON.parse(localStorage.getItem('snakeScores')) || [];
    scores.push({ name: playerName, score });
    localStorage.setItem('snakeScores', JSON.stringify(scores));
}

const increaseSpeed = () => {
    gameSpeed = Math.max(maxGameSpeed, initialGameSpeed - (score - 4) * speedIncrement);
    clearInterval(moveInterval);
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
}

submitNameButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    startGame();
});

continueButton.addEventListener('click', () => {
    continueGame();
});

startButton.addEventListener('click', () => {
    startActualGame();
});

restartButton.addEventListener('click', () => {
    gameOverInfo.style.display = 'none';
    userModal.style.display = 'flex';
    playerNameInput.value = '';
    warning.innerText = '';
});
