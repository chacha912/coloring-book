<script>
  import { nanoid } from 'nanoid';
  import { onMount } from 'svelte';
  import { mode, lineWidth, colorCode, paths } from '../store.js';

  let canvas;
  let ctx;
  let width = 700;
  let height = 700;
  let currentPathId;

  onMount(() => {
    ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  });

  const handlePointerDown = (e) => {
    const path = {};
    currentPathId = nanoid();
    path.id = currentPathId;
    path.mode = $mode;
    path.lineWidth = $lineWidth[$mode];
    path.strokeStyle = $mode === 'eraser' ? '#ffffff' : $colorCode;

    const point1 = { x: e.offsetX, y: e.offsetY };
    const point2 = { x: e.offsetX + 0.001, y: e.offsetY + 0.001 };
    path.points = [point1, point2];

    paths.set([...$paths, path]);
  };

  const handlePointerMove = (e) => {
    showCursor(e, $lineWidth[$mode]);
    if (!currentPathId) return;

    const point = { x: e.offsetX, y: e.offsetY };

    const newPaths = [...$paths];
    newPaths.find((p) => p.id === currentPathId).points.push(point);

    paths.set(newPaths);
  };

  const handlePointerUp = (e) => {
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
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointerout={hideCursor}
  on:blur={hideCursor}
/>
<svelte:body on:pointerup={handlePointerUp} />

<style>
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
