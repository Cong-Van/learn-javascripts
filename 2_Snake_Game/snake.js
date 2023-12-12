import { randomGridPosition, revertPosition } from "./grid.js";
import { getInputDirection } from "./input.js";

export const SNAKE_SPEED = 10;
const snakeBody = [randomGridPosition()];
let newSegments = 0;

export function update() {
  addSegments();

  // Gán các phần tử của rắn thành một phần tử mới có tọa độ giống phần tử trước nó
  const inputDirection = getInputDirection();
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;

  // Chế độ kinh điển, rắn đi xuyên tường
  snakeBody[0].x = revertPosition(snakeBody[0].x);
  snakeBody[0].y = revertPosition(snakeBody[0].y);
}

export function draw(gameBoard) {
  snakeBody.forEach((segment) => {
    const snakeEl = document.createElement("div");
    snakeEl.style.gridRowStart = segment.y;
    snakeEl.style.gridColumnStart = segment.x;
    snakeEl.classList.add("snake");
    gameBoard.appendChild(snakeEl);
  });
}

// Thêm vào lượng chiều dài tăng thêm
export function expandSnake(amout) {
  newSegments += amout;
}

// Kiểm tra position có nằm trên rắn không, bỏ qua so sánh với vị trí đầu mặc định là false
export function onSnake(position, ignoreHead = false) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return equalPosition(segment, position);
  });
}

export function getSnakeHead() {
  return snakeBody[0];
}

// Kiểm tra đầu rắn có giao với thân không, bỏ qua vị trí đầu rắn là true
export function snakeInterSection() {
  return onSnake(snakeBody[0], true);
}

function equalPosition(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

// Thêm lượng chiều dài là newSegments cho rắn khi rắn ăn được food
// rồi reset newSegments về 0
function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
}
