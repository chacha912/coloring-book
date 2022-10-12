import { nanoid } from 'nanoid';

const canvas = document.querySelector('.canvas-draw');
const ctx = canvas.getContext('2d');
const cursorCanvas = document.querySelector('.canvas-cursor');
const cursorCanvasContext = cursorCanvas.getContext('2d');

const toolbar = document.querySelector('.toolbar');
let toolItem = document.querySelector('.toolbar-item.selected');
const colorPanel = document.querySelector('.color-panel');

const CANVAS_SIZE = 700;
// const paths = {};
let yorkieDoc;

let mode = 'marker';
let currentPathId = null;
let currentStrokeStyle = '#000';
let currentLineWidth = 10;

function initCanvas() {
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  cursorCanvas.width = CANVAS_SIZE;
  cursorCanvas.height = CANVAS_SIZE;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = currentLineWidth;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.log(paths);
  const paths = yorkieDoc.getRoot().paths;
  Object.keys(paths).forEach((pathId) => {
    const { points, strokeStyle, lineWidth } = paths[pathId];
    ctx.beginPath();

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;

    points.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else {
        const controlPoint = points[i - 1];

        const endPoint = {
          x: (controlPoint.x + point.x) / 2,
          y: (controlPoint.y + point.y) / 2,
        };

        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
      }
    });

    ctx.stroke();

    ctx.closePath();
  });
}

function setEvent() {
  toolbar.addEventListener('click', (e) => {
    onClickToolbar(e);
  });

  colorPanel.addEventListener('click', (e) => {
    onClickColorPanel(e);
  });

  cursorCanvas.addEventListener('mousedown', (e) => {
    onMouseDown(e);
  });
  cursorCanvas.addEventListener('mousemove', (e) => {
    onMouseMove(e);
  });
  cursorCanvas.addEventListener('mouseup', (e) => {
    onMouseUp(e);
  });
  cursorCanvas.addEventListener('mouseout', (e) => {
    onMouseOut(e);
  });

  document.body.addEventListener('mouseup', (e) => {
    onMouseUp(e);
  });
}

function onClickToolbar(e) {
  const target = e.target.closest('.toolbar-item');
  if (!target) return;

  const currentTool = document.querySelector('.toolbar-item.selected');
  if (currentTool === target) return;

  toolItem = target;
  mode = target.getAttribute('data-mode');
  if (mode === 'marker') {
    currentStrokeStyle = target.getAttribute('data-color');
    currentLineWidth = 10;
  } else if (mode === 'eraser') {
    currentStrokeStyle = '#fff'; // background color
    currentLineWidth = 100;
  }

  currentTool.classList.remove('selected');
  target.classList.add('selected');
}

function onClickColorPanel(e) {
  if (mode !== 'marker') return;

  const target = e.target.closest('.color-pick');
  if (!target) return;

  const color = target.getAttribute('data-color');
  currentStrokeStyle = color;
  toolItem.style.fill = color;
  toolItem.setAttribute('data-color', color);
}

function onMouseDown(e) {
  currentPathId = nanoid();

  const path = {};
  path.mode = mode;
  path.strokeStyle = currentStrokeStyle;
  path.lineWidth = currentLineWidth;

  const point1 = { x: e.offsetX, y: e.offsetY };
  const point2 = { x: e.offsetX + 0.001, y: e.offsetY + 0.001 };

  path.points = [point1, point2];
  // paths[currentPathId] = path;
  yorkieDoc.update((root) => {
    root.paths[currentPathId] = path;
  });
  render();
}

function onMouseMove(e) {
  showCursor(e);
  if (!currentPathId) return;

  // const path = paths[currentPathId];
  // const point = { x: e.offsetX, y: e.offsetY };
  // path.points.push(point);

  yorkieDoc.update((root) => {
    const path = root.paths[currentPathId];
    const point = { x: e.offsetX, y: e.offsetY };
    path.points.push(point);
  });

  render();
}

function onMouseUp(e) {
  currentPathId = null;
}

function onMouseOut(e) {
  hideCursor();
}

function showCursor(e) {
  const ctx = cursorCanvasContext;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'gray';

  const radius = currentLineWidth / 2;
  const x = e.offsetX;
  const y = e.offsetY;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.stroke();
}

function hideCursor() {
  cursorCanvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

async function main() {
  const client = new yorkie.Client('https://api.yorkie.navercorp.com', {
    apiKey: 'cd2i0i4klh970ddmkdug',
  });
  await client.activate();

  const doc = new yorkie.Document('coloring-book2');
  await client.attach(doc);
  yorkieDoc = doc;
  yorkieDoc.update((root) => {
    if (!root.paths) {
      root.paths = {};
    }
  });

  client.subscribe((event) => {
    if (event.type === 'peers-changed') {
      const peers = event.value[doc.getKey()];
      document.getElementById('peersCount').innerHTML = Object.entries(peers).length;
    }
  });

  doc.subscribe((event) => {
    if (event.type === 'local-change') {
      return;
    }

    render();
  });
}

async function init() {
  initCanvas();
  setEvent();
  await main();
  render();
}

init();
