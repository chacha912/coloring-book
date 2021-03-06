export const colors = [
  '#d500f9',
  '#651fff',
  '#0f2d82',
  '#3d5afe',
  '#00b8d4',
  '#05aa4a',
  '#7dea00',
  '#ffcc00',
  '#ff6d00',
  '#dd2c00',
  '#774b3b',
  '#000000',
];

const getRandomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

const createCrayonPattern = (color) => {
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

const setCrayonPattern = () => {
  const patterns = {};
  for (const color of colors) {
    patterns[color] = createCrayonPattern(color);
  }
  return patterns;
};

export const crayonPatterns = setCrayonPattern();
