const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

function initCanvas() {
  // set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}

initCanvas();
