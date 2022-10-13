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

function createPeerCursor(color, x, y) {
  return `
  <svg 
    class="cursor"
    style="transform: translateX(${x}px) translateY(${y}px)" 
    width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"
  >
    <path fill=${color} stroke="#FEFDFB" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" d="M19.83 9.1571C20.5067 8.89395 20.845 8.76237 20.94 8.57633C21.0223 8.41515 21.0198 8.22375 20.9333 8.06478C20.8335 7.8813 20.4918 7.75864 19.8084 7.51333L2.379 1.2566C1.81992 1.0559 1.54037 0.955556 1.35762 1.01884C1.19874 1.07387 1.07387 1.19873 1.01884 1.35762C0.955555 1.54037 1.0559 1.81992 1.2566 2.379L7.51328 19.8085C7.75859 20.4918 7.88124 20.8335 8.06473 20.9333C8.22369 21.0198 8.41509 21.0224 8.57627 20.9401C8.76231 20.8451 8.89389 20.5067 9.15705 19.83L12.0055 12.5054C12.0571 12.3728 12.0829 12.3065 12.1227 12.2507C12.1579 12.2013 12.2012 12.158 12.2507 12.1227C12.3065 12.0829 12.3728 12.0571 12.5053 12.0056L19.83 9.1571Z"/>
  </svg>
  `;
}

function updateMultiCursor(peersObj, myClientID) {
  const peers = Object.entries(peersObj);
  const COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777'];
  if (document.getElementById('cursorContainer')) {
    document.getElementById('cursorContainer').remove();
  }
  const cursorContainer = document.createElement('div');
  cursorContainer.id = 'cursorContainer';
  cursorContainer.innerHTML = peers
    .map(([id, { point }], i) => {
      if (id === myClientID) return;
      if (!point) return;
      return createPeerCursor(COLORS[i], point.x, point.y);
    })
    .join('');
  document.body.appendChild(cursorContainer);
}

async function main() {
  const client = new yorkie.Client('https://api.yorkie.navercorp.com', {
    apiKey: 'cd2i0i4klh970ddmkdug',
    presence: {
      point: { x: 0, y: 0 },
    },
  });
  await client.activate();
  const myClientID = client.getID();

  const doc = new yorkie.Document('coloring-book5');
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
      updateMultiCursor(peers, myClientID);
    }
  });

  doc.subscribe((event) => {
    if (event.type === 'local-change') {
      return;
    }

    render();
  });

  document.body.addEventListener('mousemove', (e) => {
    client.updatePresence('point', {
      x: e.clientX,
      y: e.clientY,
    });
  });

  document.body.addEventListener('mouseleave', () => {
    client.updatePresence('point', null);
  });
}

async function init() {
  initCanvas();
  setEvent();
  await main();
  render();
}

init();
