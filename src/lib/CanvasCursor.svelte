<script>
  import { nanoid } from 'nanoid';
  import { onMount } from 'svelte';
  import { mode, lineWidth, colorCode, paths } from '../store.js';
  import { getCrayonPattern } from '../util.js';

  let canvas;
  let ctx;
  let width = 700;
  let height = 700;
  let currentPathId;

  onMount(() => {
    ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
  });

  const handleMouseDown = (e) => {
    currentPathId = nanoid();

    const path = {};
    path.mode = $mode;
    path.lineWidth = $lineWidth[$mode];

    if ($mode === 'marker') {
      path.strokeStyle = $colorCode;
    } else if ($mode === 'crayon') {
      path.strokeStyle = getCrayonPattern($colorCode);
    } else if ($mode === 'eraser') {
      path.strokeStyle = '#fff'; // background color
    }

    const point1 = { x: e.offsetX, y: e.offsetY };
    const point2 = { x: e.offsetX + 0.001, y: e.offsetY + 0.001 };

    path.points = [point1, point2];

    const newPaths = { ...$paths };
    newPaths[currentPathId] = path;

    paths.set(newPaths);
  };

  const handleMouseMove = (e) => {
    showCursor(e, $lineWidth[$mode]);
    if (!currentPathId) return;

    const point = { x: e.offsetX, y: e.offsetY };

    const newPaths = { ...$paths };
    newPaths[currentPathId].points.push(point);

    paths.set(newPaths);
  };

  const handleMouseUp = (e) => {
    currentPathId = null;
  };

  const showCursor = (e, lineWidth) => {
    ctx.clearRect(0, 0, width, height);

    const radius = lineWidth / 2;
    const x = e.offsetX;
    const y = e.offsetY;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.stroke();
  };

  const hideCursor = () => {
    ctx.clearRect(0, 0, width, height);
  };
</script>

<canvas
  bind:this={canvas}
  style:width
  style:height
  {width}
  {height}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:mouseout={hideCursor}
  on:blur={hideCursor}
/>
<svelte:body on:mouseup={handleMouseUp} />

<style>
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
