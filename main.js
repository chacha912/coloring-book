import { nanoid } from 'nanoid';
import materialColors from './material-colors';

const toolbar = document.querySelector('.toolbar');

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const paths = {};
let currentPathId = null;
let currentStrokeStyle = '#000';
let mode = 'pen';
const CANVAS_SIZE = 700;

function initCanvas() {
  // set canvas sizethis.canvas.width = CANVAS_SIZE;
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  // set stroke options
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 10;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Object.keys(paths).forEach((pathId) => {
    const { mode, points, strokeStyle } = paths[pathId];
    ctx.beginPath();

    ctx.strokeStyle = strokeStyle;

    points.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else {
        const controlPoint = points[i - 1];

        const endPoint = {
          x: (controlPoint.x + point.x) / 2,
          y: (controlPoint.y + point.y) / 2,
        };

        ctx.quadraticCurveTo(
          controlPoint.x,
          controlPoint.y,
          endPoint.x,
          endPoint.y
        );
      }
    });

    ctx.stroke();

    ctx.closePath();
  });
}

function getCrayonPattern(color) {
  const patternCanvas = document.createElement('canvas');
  const ctx = patternCanvas.getContext('2d');
  const size = 100;
  patternCanvas.width = size;
  patternCanvas.height = size;

  for (let i = size * size; i--; ) {
    const x = getRandomFloat(0, size);
    const y = getRandomFloat(0, size);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  return ctx.createPattern(patternCanvas, 'repeat');
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

canvas.addEventListener('mousedown', (e) => {
  currentPathId = nanoid();

  const path = {};
  path.mode = mode;

  if (mode === 'pen') {
    path.strokeStyle = currentStrokeStyle;
  } else if (mode === 'crayon') {
    path.strokeStyle = getCrayonPattern(currentStrokeStyle);
  }

  const point1 = { x: e.offsetX, y: e.offsetY };
  const point2 = { x: e.offsetX + 0.001, y: e.offsetY + 0.001 }; // paint point on click

  path.points = [point1, point2];

  paths[currentPathId] = path;
  render();
});

canvas.addEventListener('mousemove', (e) => {
  if (!currentPathId) return;

  const path = paths[currentPathId];
  const point = { x: e.offsetX, y: e.offsetY };
  path.points.push(point);

  render();
});

document.addEventListener('mouseup', (e) => {
  currentPathId = null;
});

function initColorPanel(colorPalette) {
  const $colorPanel = document.querySelector('.color-panel');

  const $colorfrag = document.createDocumentFragment();

  Object.values(colorPalette).forEach((colors) => {
    const $colors = document.createElement('ul');
    $colors.classList.add('color-container');

    Object.values(colors).forEach((color) => {
      const $color = document.createElement('li');
      $color.classList.add('color');
      $color.setAttribute('data-color', color);
      $color.style.backgroundColor = color;

      $colors.appendChild($color);
    });

    $colorfrag.appendChild($colors);
  });

  $colorPanel.appendChild($colorfrag);

  $colorPanel.addEventListener('click', (e) => {
    if (!e.target.classList.contains('color')) {
      return;
    }

    currentStrokeStyle = e.target.getAttribute('data-color');
  });
}

toolbar.addEventListener('click', (e) => {
  if (!e.target.classList.contains('toolbar-item')) return;
  mode = e.target.getAttribute('data-mode');
});

initCanvas();
// initColorPanel(materialColors);
