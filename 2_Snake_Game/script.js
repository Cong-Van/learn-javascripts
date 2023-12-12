import {
  update as updateSnake,
  draw as drawSnake,
  getSnakeHead,
  snakeInterSection,
  SNAKE_SPEED,
} from "./snake.js";

import { update as updateFood, draw as drawFood } from "./food.js";

import { outsideGrid } from "./grid.js";

const gameBoard = document.getElementById("game-board");
let gameOver = false;
let lastRenderTime = 0;

function main(currentTime) {
  if (gameOver) {
    if (confirm('You lost. Press "OK" to restart')) {
      window.location = "/";
    }
    return;
  }

  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;

  lastRenderTime = currentTime;
  update();
  draw();
}

window.requestAnimationFrame(main);

function update() {
  updateFood();
  updateSnake();
  checkDeath();
}

function draw() {
  gameBoard.innerHTML = "";
  drawFood(gameBoard);
  drawSnake(gameBoard);
}

function checkDeath() {
  gameOver = snakeInterSection();
}

// function checkDeath() {
//   gameOver = outsideGrid(getSnakeHead()) || snakeInterSection();
// }
