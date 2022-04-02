import { nanoid } from 'nanoid';
import materialColors from './material-colors';

const toolbar = document.querySelector('.toolbar');

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const paths = {};
let currentPathId = null;
let currentStrokeStyle = '#000';
let mode = 'pen';
let rectInitPoint = null;

function initCanvas() {
  // set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

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

    switch (mode) {
      case 'pen':
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

        break;

      case 'rectangle':
        ctx.strokeRect(...points);
        break;

      default:
        break;
    }
    ctx.closePath();
  });
}

canvas.addEventListener('mousedown', (e) => {
  currentPathId = nanoid();

  const path = {};
  path.mode = mode;
  path.strokeStyle = currentStrokeStyle;

  switch (mode) {
    case 'pen':
      const point1 = { x: e.offsetX, y: e.offsetY };
      const point2 = { x: e.offsetX + 0.001, y: e.offsetY + 0.001 }; // paint point on click

      path.points = [point1, point2];
      break;

    case 'rectangle':
      rectInitPoint = { x: e.offsetX, y: e.offsetY };
      path.points = [e.offsetX, e.offsetY, 1, 1];

    default:
      break;
  }

  paths[currentPathId] = path;
  render();
});

canvas.addEventListener('mousemove', (e) => {
  if (!currentPathId) return;

  const path = paths[currentPathId];
  switch (mode) {
    case 'pen':
      const point = { x: e.offsetX, y: e.offsetY };
      path.points.push(point);
      break;

    case 'rectangle':
      const { x: x1, y: y1 } = rectInitPoint;
      const { offsetX: x2, offsetY: y2 } = e;
      const dx = x2 - x1;
      const dy = y2 - y1;

      let initPoint = { x: x1, y: y1 };

      if (dx > 0 && dy < 0) {
        initPoint.y = y2;
      } else if (dx < 0 && dy > 0) {
        initPoint.x = x2;
      } else if (dx < 0 && dy < 0) {
        initPoint.x = x2;
        initPoint.y = y2;
      }

      path.points = [initPoint.x, initPoint.y, Math.abs(dx), Math.abs(dy)];

    default:
      break;
  }
  render();
});

document.addEventListener('mouseup', (e) => {
  currentPathId = null;
  rectInitPoint = null;
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
initColorPanel(materialColors);
