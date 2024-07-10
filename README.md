# JavaScript Tetris Game

![Gameplay Screenshot](gameplay_screenshot.png)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Controls](#controls)
- [Gameplay](#gameplay)
- [Development](#development)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The JavaScript Tetris Game is a classic implementation of the popular puzzle game built entirely in JavaScript using the HTML5 Canvas element. Players manipulate falling Tetromino shapes, rotating them to create complete horizontal lines which then disappear, earning points.

## Features

- **Dynamic Gameplay:** Control Tetromino shapes using keyboard inputs to move left, right, rotate, and drop faster.
- **Scoring System:** Earn points by completing rows. Each completed row increases the score.
- **Level Up:** Progress through levels as the game speeds up with each level increase.
- **Game Over:** The game ends when Tetrominoes stack up to the top of the screen, displaying a "Game Over" message.

## Technologies Used

- **JavaScript:** Core programming language for game logic and user interactions.
- **HTML5 Canvas:** Used for rendering graphics and creating the game board.
- **Git:** Version control system for tracking changes and collaborating on code.
- **GitHub:** Hosting platform for repository management and project documentation.

## Setup Instructions

To run the JavaScript Tetris Game locally on your machine, follow these steps:

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/tetris-game.git
    ```

2. **Navigate to the Project Directory:**

    ```bash
    Open index.html using your preferred web browser.
    ```

## Controls

- **Left Arrow (←):** Move Tetromino left.
- **Right Arrow (→):** Move Tetromino right.
- **Down Arrow (↓):** Speed up Tetromino descent.
- **Up Arrow (↑):** Rotate Tetromino clockwise.

## Gameplay

1. **Objective:**
- Arrange falling Tetrominoes to complete horizontal lines without gaps.

2. **Scoring:**
- **Single Line Clear:** 100 points.
- **Double Line Clear:** 300 points.
- **Triple Line Clear:** 500 points.
- **Tetris (Four Line Clear):** 800 points.

3. **Level Up:**
- The game speeds up with each level increase.

## Development

The game is developed using object-oriented principles in JavaScript. It utilizes arrays and matrices to manage game state and logic. Collision detection ensures Tetrominoes stack correctly, while rotation mechanics simulate Tetromino rotation within the game board boundaries.

## Future Improvements

Future updates and enhancements planned for the JavaScript Tetris Game include:

- **Sound Effects:** Add sound effects for Tetromino movements and line completions.
- **Responsive Design:** Optimize the game for various screen sizes and orientations.
- **Touch Controls:** Implement touch-based controls for mobile devices.

## Contributing

Contributions to the JavaScript Tetris Game project are welcome! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.