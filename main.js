import { nanoid } from 'nanoid';

const CANVAS_SIZE = 700;

class App {
  constructor() {
    this.canvas = document.querySelector('.canvas-draw');
    this.ctx = this.canvas.getContext('2d');
    this.paths = {};
    this.currentPathId = null;
    this.currentStrokeStyle = this.getCrayonPattern('#000');
    this.currentLineWidth = 10;
    this.mode = 'crayon';

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
      const { mode, points, strokeStyle } = this.paths[pathId];
      this.ctx.beginPath();

      this.ctx.strokeStyle = strokeStyle;

      points.forEach((point, i) => {
        if (i === 0) this.ctx.moveTo(point.x, point.y);
        else {
          const controlPoint = points[i - 1];

          const endPoint = {
            x: (controlPoint.x + point.x) / 2,
            y: (controlPoint.y + point.y) / 2,
          };

          this.ctx.quadraticCurveTo(
            controlPoint.x,
            controlPoint.y,
            endPoint.x,
            endPoint.y
          );
        }
      });

      this.ctx.stroke();

      this.ctx.closePath();
    });
  }

  getCrayonPattern(color) {
    const patternCanvas = document.createElement('canvas');
    const ctx = patternCanvas.getContext('2d');
    const size = 100;
    patternCanvas.width = size;
    patternCanvas.height = size;

    for (let i = size * size; i--; ) {
      const x = this.getRandomFloat(0, size);
      const y = this.getRandomFloat(0, size);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }

    return ctx.createPattern(patternCanvas, 'repeat');
  }

  getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  setEvent() {
    this.toolbar.addEventListener('click', (e) => {
      const target = e.target.closest('.toolbar-item');
      if (!target) return;

      const currTool = document.querySelector('.toolbar-item.selected');
      if (currTool === target) return;

      this.mode = target.getAttribute('data-mode');
      this.toolItem = target;
      this.currentStrokeStyle = target.getAttribute('data-color');

      if (this.mode === 'marker') {
        this.colorPanel.classList.remove('crayon-mode');
        this.colorPanel.classList.add('marker-mode');
      } else if (this.mode === 'crayon') {
        this.colorPanel.classList.remove('marker-mode');
        this.colorPanel.classList.add('crayon-mode');
      }
      currTool.classList.remove('selected');
      target.classList.add('selected');
    });

    this.colorPanel.addEventListener('click', (e) => {
      const target = e.target.closest('.color-pick');
      if (!target) return;

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

    if (this.mode === 'marker') {
      path.strokeStyle = this.currentStrokeStyle;
    } else if (this.mode === 'crayon') {
      path.strokeStyle = this.getCrayonPattern(this.currentStrokeStyle);
    } else if (this.mode === 'eraser') {
      path.strokeStyle = '#fff'; // background color
    }

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
    this.cursorCanvasContext.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
}

new App();
