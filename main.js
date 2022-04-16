import { nanoid } from 'nanoid';

const CANVAS_SIZE = 700;

class App {
  constructor() {
    this.canvas = document.querySelector('.canvas-draw');
    this.ctx = this.canvas.getContext('2d');
    this.paths = {};
    this.currentPathId = null;
    this.currentStrokeStyle = '#000';
    this.currentLineWidth = 10;
    this.toolbar = document.querySelector('.toolbar');
    this.toolItem = document.querySelector('.toolbar-item.selected');
    this.colorPanel = document.querySelector('.color-panel');

    this.cursorCanvas = document.querySelector('.canvas-cursor');
    this.cursorCanvasContext = this.cursorCanvas.getContext('2d');

    this.initCanvas();
    this.setEvent();
  }

  initCanvas() {
    this.canvas.width = CANVAS_SIZE;
    this.canvas.height = CANVAS_SIZE;
    this.cursorCanvas.width = CANVAS_SIZE;
    this.cursorCanvas.height = CANVAS_SIZE;

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = this.currentLineWidth;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    Object.keys(this.paths).forEach((pathId) => {
      const { points, strokeStyle, lineWidth } = this.paths[pathId];
      this.ctx.beginPath();

      this.ctx.strokeStyle = strokeStyle;
      this.ctx.lineWidth = lineWidth;

      points.forEach((point, i) => {
        if (i === 0) this.ctx.moveTo(point.x, point.y);
        else {
          const controlPoint = points[i - 1];

          const endPoint = {
            x: (controlPoint.x + point.x) / 2,
            y: (controlPoint.y + point.y) / 2,
          };

          this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
        }
      });

      this.ctx.stroke();

      this.ctx.closePath();
    });
  }

  setEvent() {
    this.toolbar.addEventListener('click', (e) => {
      const target = e.target.closest('.toolbar-item');
      if (!target) return;

      const currTool = document.querySelector('.toolbar-item.selected');
      if (currTool === target) return;

      this.mode = target.getAttribute('data-mode');
      this.toolItem = target;
      if (this.mode === 'marker') {
        this.currentStrokeStyle = target.getAttribute('data-color');
        this.currentLineWidth = 10;
      } else if (this.mode === 'eraser') {
        this.currentStrokeStyle = '#fff'; // background color
        this.currentLineWidth = 100;
      }

      currTool.classList.remove('selected');
      target.classList.add('selected');
    });

    this.colorPanel.addEventListener('click', (e) => {
      const target = e.target.closest('.color-pick');
      if (!target) return;
      if (this.mode !== 'marker') return;

      const color = target.getAttribute('data-color');
      this.currentStrokeStyle = color;
      this.toolItem.style.fill = color;
      this.toolItem.setAttribute('data-color', color);
    });

    this.cursorCanvas.addEventListener('mousedown', (e) => {
      this.handleMouseDown(e);
    });
    this.cursorCanvas.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e);
    });
    this.cursorCanvas.addEventListener('mouseup', (e) => {
      this.handleMouseUp(e);
    });
    this.cursorCanvas.addEventListener('mouseout', () => {
      this.hideCursor();
    });

    document.body.addEventListener('mouseup', (e) => {
      this.handleMouseUp(e);
    });
  }

  handleMouseDown(e) {
    this.currentPathId = nanoid();

    const path = {};
    path.mode = this.mode;
    path.strokeStyle = this.currentStrokeStyle;
    path.lineWidth = this.currentLineWidth;

    const point1 = { x: e.offsetX, y: e.offsetY };
    const point2 = { x: e.offsetX + 0.001, y: e.offsetY + 0.001 };

    path.points = [point1, point2];

    this.paths[this.currentPathId] = path;
    this.render();
  }

  handleMouseMove(e) {
    this.showCursor(e);
    if (!this.currentPathId) return;

    const path = this.paths[this.currentPathId];
    const point = { x: e.offsetX, y: e.offsetY };
    path.points.push(point);

    this.render();
  }

  handleMouseUp(e) {
    this.currentPathId = null;
  }

  showCursor(e) {
    const ctx = this.cursorCanvasContext;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';

    const radius = this.currentLineWidth / 2;
    const x = e.offsetX;
    const y = e.offsetY;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.stroke();
  }

  hideCursor() {
    this.cursorCanvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

new App();
