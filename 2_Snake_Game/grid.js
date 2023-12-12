const GRID_SIZE = 22;

export function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1,
  };
}

//  Chế độ chơi box, khi đâm vào tường sẽ die
export function outsideGrid(position) {
  return (
    position.x < 1 ||
    GRID_SIZE < position.x ||
    position.y < 1 ||
    GRID_SIZE < position.y
  );
}

// Chế độ kinh điển, đi xuyên tường
export function revertPosition(element) {
  if (element < 1) return element + GRID_SIZE;
  if (GRID_SIZE < element) return element - GRID_SIZE;
  return element;
}
