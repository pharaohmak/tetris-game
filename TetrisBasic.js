let canvas;
let ctx;
const gBArrayHeight = 20; // Number of cells in array height
const gBArrayWidth = 12; // Number of cells in array width
let startX = 4; // Starting X position for Tetromino
let startY = 0; // Starting Y position for Tetromino
let score = 0; // Tracks the score
let level = 1; // Tracks current level
let winOrLose = "Playing";
let gameStarted = false; // Tracks if the game has started

// Used as a look up table where each value in the array
// contains the x & y position we can use to draw the
// box on the canvas
const coordinateArray = [...Array(gBArrayHeight)].map(() => Array(gBArrayWidth).fill(0));

let curTetromino = [[1, 0], [0, 1], [1, 1], [2, 1]];

// Will hold all the Tetrominos 
const tetrominos = [];
// The tetromino array with the colors matched to the tetrominos array
const tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
// Holds current Tetromino color
let curTetrominoColor;

// Create gameboard array so we know where other squares are
const gameBoardArray = [...Array(gBArrayHeight)].map(() => Array(gBArrayWidth).fill(0));

// Array for storing stopped shapes
// It will hold colors when a shape stops and is added
const stoppedShapeArray = [...Array(gBArrayHeight)].map(() => Array(gBArrayWidth).fill(0));

// Created to track the direction I'm moving the Tetromino
// so that I can stop trying to move through walls
const DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Execute SetupCanvas when page loads
document.addEventListener('DOMContentLoaded', SetupCanvas);

// Creates the array with square coordinates [Lookup Table]
function CreateCoordArray() {
    let i = 0, j = 0;
    for (let y = 9; y <= 446; y += 23) {
        for (let x = 11; x <= 264; x += 23) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    // Double the size of elements to fit the screen
    ctx.scale(2, 2);

    // Draw Canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw gameboard rectangle
    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    const tetrisLogo = new Image(161, 54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetrislogo.png";

    // Set font for score label text and draw
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);

    // Draw score rectangle
    ctx.strokeRect(300, 107, 161, 24);

    // Draw score
    ctx.fillText(score.toString(), 310, 127);

    // Draw level label text
    ctx.fillText("LEVEL", 300, 157);

    // Draw level rectangle
    ctx.strokeRect(300, 171, 161, 24);

    // Draw level
    ctx.fillText(level.toString(), 310, 190);

    // Draw next label text
    ctx.fillText("WIN / LOSE", 300, 221);

    // Draw playing condition
    ctx.fillText(winOrLose, 310, 261);

    // Draw playing condition rectangle
    ctx.strokeRect(300, 232, 161, 95);

    // Draw controls label text
    ctx.fillText("CONTROLS", 300, 354);

    // Draw controls rectangle
    ctx.strokeRect(300, 366, 161, 104);

    // Draw controls text
    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate Right", 310, 463);

    // Handle keyboard presses
    document.addEventListener('keydown', HandleKeyPress);

    // Add event listener for the start button
    document.getElementById('start-button').addEventListener('click', StartGame);
}

function StartGame() {
    if (!gameStarted) {
        gameStarted = true;
        document.getElementById('start-button').style.display = 'none';
        document.getElementById('my-canvas').style.display = 'block';

        // Create the array of Tetromino arrays
        CreateTetrominos();
        // Generate random Tetromino
        CreateTetromino();

        // Create the rectangle lookup table
        CreateCoordArray();

        // Draw the initial state of the game
        DrawTetromino();

        // Automatically calls for a Tetromino to fall every second
        window.setInterval(() => {
            if (winOrLose !== "Game Over") {
                MoveTetrominoDown();
            }
        }, 1000);
    }
}

function DrawTetrisLogo() {
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino() {
    // Cycle through the x & y array for the tetromino looking
    // for all the places a square would be drawn
    for (let i = 0; i < curTetromino.length; i++) {
        // Move the Tetromino x & y values to the tetromino
        // shows in the middle of the gameboard
        const x = curTetromino[i][0] + startX;
        const y = curTetromino[i][1] + startY;

        // Put Tetromino shape in the gameboard array
        gameBoardArray[x][y] = 1;

        // Look for the x & y values in the lookup table
        const coorX = coordinateArray[x][y].x;
        const coorY = coordinateArray[x][y].y;

        // Draw a square at the x & y coordinates that the lookup
        // table provides
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyPress(key) {
    if (winOrLose !== "Game Over" && gameStarted) {
        switch (key.keyCode) {
            case 65: // a keycode (LEFT)
                direction = DIRECTION.LEFT;
                if (!HittingTheWall() && !CheckForHorizontalCollision()) {
                    DeleteTetromino();
                    startX--;
                    DrawTetromino();
                }
                break;
            case 68: // d keycode (RIGHT)
                direction = DIRECTION.RIGHT;
                if (!HittingTheWall() && !CheckForHorizontalCollision()) {
                    DeleteTetromino();
                    startX++;
                    DrawTetromino();
                }
                break;
            case 83: // s keycode (DOWN)
                MoveTetrominoDown();
                break;
            case 69: // e keycode (ROTATE)
                RotateTetromino();
                break;
        }
    }
}

function MoveTetrominoDown() {
    direction = DIRECTION.DOWN;
    if (!CheckForVerticalCollision()) {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

function DeleteTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        const x = curTetromino[i][0] + startX;
        const y = curTetromino[i][1] + startY;

        // Delete Tetromino square from the gameboard array
        gameBoardArray[x][y] = 0;

        // Draw white where colored squares used to be
        const coorX = coordinateArray[x][y].x;
        const coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function CreateTetrominos() {
    tetrominos.push([[1, 0], [0, 1], [1, 1], [2, 1]]); // T
    tetrominos.push([[0, 0], [1, 0], [2, 0], [3, 0]]); // I
    tetrominos.push([[0, 0], [0, 1], [1, 1], [2, 1]]); // J
    tetrominos.push([[0, 0], [1, 0], [0, 1], [1, 1]]); // Square
    tetrominos.push([[2, 0], [0, 1], [1, 1], [2, 1]]); // L
    tetrominos.push([[1, 0], [2, 0], [0, 1], [1, 1]]); // S
    tetrominos.push([[0, 0], [1, 0], [1, 1], [2, 1]]); // Z
}

function CreateTetromino() {
    const randomTetromino = Math.floor(Math.random() * tetrominos.length);
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino];
}

function HittingTheWall() {
    return curTetromino.some(([x]) => {
        const newX = x + startX;
        return (newX <= 0 && direction === DIRECTION.LEFT) || (newX >= 11 && direction === DIRECTION.RIGHT);
    });
}

function CheckForVerticalCollision() {
    const tetrominoCopy = curTetromino;
    let collision = false;

    for (let i = 0; i < tetrominoCopy.length; i++) {
        const [x, y] = tetrominoCopy[i];
        const newX = x + startX;
        const newY = y + startY + 1;

        if (typeof stoppedShapeArray[newX][newY] === 'string' || newY >= 20) {
            collision = true;
            break;
        }
    }

    if (collision) {
        if (startY <= 2) {
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        } else {
            for (let i = 0; i < tetrominoCopy.length; i++) {
                const [x, y] = tetrominoCopy[i];
                stoppedShapeArray[x + startX][y + startY] = curTetrominoColor;
            }
            CheckForCompletedRows();
            CreateTetromino();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }

    return collision;
}

function CheckForHorizontalCollision() {
    const tetrominoCopy = curTetromino;
    return tetrominoCopy.some(([x, y]) => {
        const newX = x + startX + (direction === DIRECTION.LEFT ? -1 : 1);
        return typeof stoppedShapeArray[newX][y + startY] === 'string';
    });
}

function CheckForCompletedRows() {
    let rowsToDelete = 0;
    let startOfDeletion = 0;

    for (let y = 0; y < gBArrayHeight; y++) {
        if (stoppedShapeArray.every((row, x) => row[y] !== 0)) {
            if (startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for (let x = 0; x < gBArrayWidth; x++) {
                stoppedShapeArray[x][y] = 0;
                gameBoardArray[x][y] = 0;
                const coorX = coordinateArray[x][y].x;
                const coorY = coordinateArray[x][y].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }

    if (rowsToDelete > 0) {
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (let i = startOfDeletion - 1; i >= 0; i--) {
        for (let x = 0; x < gBArrayWidth; x++) {
            const y2 = i + rowsToDelete;
            const square = stoppedShapeArray[x][i];
            if (typeof square === 'string') {
                stoppedShapeArray[x][y2] = square;
                gameBoardArray[x][y2] = 1;
                const coorX = coordinateArray[x][y2].x;
                const coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = square;
                ctx.fillRect(coorX, coorY, 21, 21);
                stoppedShapeArray[x][i] = 0;
                gameBoardArray[x][i] = 0;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function RotateTetromino() {
    const newRotation = curTetromino.map(([x, y]) => [GetLastSquareX() - y, x]);
    const curTetrominoBU = [...curTetromino];

    DeleteTetromino();

    try {
        curTetromino = newRotation;
        DrawTetromino();
    } catch (e) {
        if (e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

function GetLastSquareX() {
    return Math.max(...curTetromino.map(([x]) => x));
}