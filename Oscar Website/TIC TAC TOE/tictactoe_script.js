const cells = document.querySelectorAll('.cell');
const gameContainer = document.getElementById('game-container');
const scoreContainer = document.getElementById('score-container');
const restartButton = document.getElementById('restart-btn');
const resetScoreButton = document.getElementById('reset-score-btn');
const messageElement = document.getElementById('message');
const xWinsElement = document.getElementById('x-wins');
const oWinsElement = document.getElementById('o-wins');
const modeSelection = document.getElementById('mode-selection');
const playerVsPlayerBtn = document.getElementById('player-vs-player-btn');
const playerVsAIBtn = document.getElementById('player-vs-ai-btn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let xWins = 0;
let oWins = 0;
let isAI = false;

const xImage = 's_x_icon.png'; // Image for X
const oImage = 's_o_icon.png'; // Image for O

// Function to choose the game mode (Player vs Player or Player vs AI)
function chooseGameMode(mode) {
    if (mode === 'ai') {
        isAI = true;
        currentPlayer = 'X'; // Human always starts
        messageElement.textContent = 'You are X. AI is O.';
    } else {
        isAI = false;
        currentPlayer = 'X'; // Player vs Player starts with X
        messageElement.textContent = 'Player 1 is X. Player 2 is O.';
    }
	modeSelection.style.display = 'none'; // Hide the mode selection
	gameContainer.style.display = 'block'; // Hide the mode selection
	scoreContainer.style.display = 'flex'; // Hide the mode selection
	messageElement.classList.add('visible');
    restartGame(); // Start a new game
}

// AI logic (Simple random move)
// AI logic (Simple blocking and random move)
function aiMove() {
    if (gameActive && currentPlayer === 'O') {
        // Get the available cells
        let availableCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') availableCells.push(i);
        }

        // Check if AI can win or block the opponent
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;

            // AI's move (O)
            if (board[a] === 'O' && board[b] === 'O' && board[c] === '') {
                const cell = document.querySelector(`[data-index="${c}"]`);
                handleCellClick({ target: cell }); // Simulate a click
                return;
            }
            if (board[a] === 'O' && board[c] === 'O' && board[b] === '') {
                const cell = document.querySelector(`[data-index="${b}"]`);
                handleCellClick({ target: cell }); // Simulate a click
                return;
            }
            if (board[b] === 'O' && board[c] === 'O' && board[a] === '') {
                const cell = document.querySelector(`[data-index="${a}"]`);
                handleCellClick({ target: cell }); // Simulate a click
                return;
            }

            // Opponent's move (X) - block opponent
            if (board[a] === 'X' && board[b] === 'X' && board[c] === '') {
                const cell = document.querySelector(`[data-index="${c}"]`);
                handleCellClick({ target: cell }); // Simulate a click
                return;
            }
            if (board[a] === 'X' && board[c] === 'X' && board[b] === '') {
                const cell = document.querySelector(`[data-index="${b}"]`);
                handleCellClick({ target: cell }); // Simulate a click
                return;
            }
            if (board[b] === 'X' && board[c] === 'X' && board[a] === '') {
                const cell = document.querySelector(`[data-index="${a}"]`);
                handleCellClick({ target: cell }); // Simulate a click
                return;
            }
        }

        // If no immediate win or block move, pick a random available cell
        if (availableCells.length > 0) {
            let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
            const cell = document.querySelector(`[data-index="${randomIndex}"]`);
            handleCellClick({ target: cell }); // Simulate a click
        }
    }
}


// Function to check if there is a winner or if it's a tie
function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Winner
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            messageElement.textContent = `${currentPlayer} wins!`;
            messageElement.classList.add('visible');
            if (currentPlayer === 'X') {
                xWins++;
                xWinsElement.textContent = xWins;
            } else {
                oWins++;
                oWinsElement.textContent = oWins;
            }
            return;
        }
    }

    // Tie
    if (!board.includes('')) {
        gameActive = false;
        messageElement.textContent = 'It\'s a tie!';
        messageElement.classList.add('visible');
    }
}

// Determines if a player can place their letter on a cell, checks if it is empty and ensures players do not switch until one player moves
function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (index === null) {
        console.error("Invalid cell index.");
        return;
    }

    const idx = parseInt(index, 10);
    if (isNaN(idx)) {
        console.error(`Invalid index: ${index}`);
        return;
    }

    // Prevent clicking if the cell is already occupied or the game is over
    if (board[idx] || !gameActive) {
        console.log(`Cell already filled or game is over. Current state: ${gameActive}`);
        return;
    }

    // Place the current player's symbol
    board[idx] = currentPlayer;
    const img = document.createElement('img');
    img.src = currentPlayer === 'X' ? xImage : oImage;
    event.target.appendChild(img);

    checkWinner(); // Check if there's a winner

    // Switch turns only if the game is still active
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (isAI && currentPlayer === 'O') {
            aiMove(); // Make the AI move
        }
    }
}

// Resets game
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    messageElement.textContent = '';
    messageElement.classList.remove('visible');
    cells.forEach(cell => {
        cell.innerHTML = '';
    });
    console.log("Game restarted.");
}

// Resets Score
function resetScore() {
    xWins = 0;
    oWins = 0;
    xWinsElement.textContent = xWins;
    oWinsElement.textContent = oWins;
    console.log("Scores reset.");
}

// Event listeners for selecting game mode
playerVsPlayerBtn.addEventListener('click', () => chooseGameMode('player'));
playerVsAIBtn.addEventListener('click', () => chooseGameMode('ai'));

// Event listeners for game actions
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
resetScoreButton.addEventListener('click', resetScore);
