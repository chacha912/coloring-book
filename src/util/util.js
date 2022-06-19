export const getCrayonPattern = (color) => {
  const patternCanvas = document.createElement('canvas');
  const ctx = patternCanvas.getContext('2d');
  const size = 100;
  patternCanvas.width = size;
  patternCanvas.height = size;

  for (let i = size * size; i--; ) {
    const x = getRandomFloat(-1, size + 1);
    const y = getRandomFloat(-1, size + 1);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  return ctx.createPattern(patternCanvas, 'repeat');
};

export const getRandomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};
