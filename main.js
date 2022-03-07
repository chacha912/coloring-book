import { nanoid } from 'nanoid';
import materialColors from './material-colors';

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const paths = {};
let currentPathId = null;
let currentStrokeStyle = '#000';

function initCanvas() {
  // set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  // set stroke options
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 6;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Object.keys(paths).forEach((pathId) => {
    const { points, strokeStyle } = paths[pathId];
    ctx.beginPath();
    points.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  });
}

canvas.addEventListener('mousedown', (e) => {
  currentPathId = nanoid();
  const point1 = { x: e.clientX, y: e.clientY };
  const point2 = { x: e.clientX + 0.001, y: e.clientY + 0.001 }; // paint point on click

  paths[currentPathId] = { strokeStyle: currentStrokeStyle };
  paths[currentPathId].points = [point1, point2];
  render();
});

canvas.addEventListener('mousemove', (e) => {
  if (currentPathId) {
    const point = { x: e.offsetX, y: e.offsetY };
    paths[currentPathId].points.push(point);
    render();
  }
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

initCanvas();
initColorPanel(materialColors);
