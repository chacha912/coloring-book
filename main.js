import { nanoid } from 'nanoid';

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const paths = {};
let currentPathId = null;

function initCanvas() {
  // set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  // set stroke options
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 6;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Object.keys(paths).forEach((pathId) => {
    const path = paths[pathId];
    ctx.beginPath();
    path.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  });
}

canvas.addEventListener('mousedown', (e) => {
  currentPathId = nanoid();
  const point1 = { x: e.clientX, y: e.clientY };
  const point2 = { x: e.clientX + 0.001, y: e.clientY + 0.001 }; // paint point on click

  paths[currentPathId] = [point1, point2];
  render();
});

canvas.addEventListener('mousemove', (e) => {
  if (currentPathId) {
    const point = { x: e.clientX, y: e.clientY };
    paths[currentPathId].push(point);
    render();
  }
});

document.addEventListener('mouseup', (e) => {
  currentPathId = null;
});

initCanvas();
