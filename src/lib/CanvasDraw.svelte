<script>
  import { onMount, onDestroy } from 'svelte';
  import { nanoid } from 'nanoid';
  import { paths } from '../store.js';
  import { crayonPatterns } from '../util/util.js';

  export let gallery;
  let canvas;
  let ctx;
  let width = 700;
  let height = 700;

  const getCanvasImage = () => {
    return canvas.toDataURL();
  };

  const saveDrawing = async () => {
    await gallery.addDrawing({
      drawingID: nanoid(),
      thumbnail: getCanvasImage(),
      drawing: $paths,
      design: '',
    });
  };

  const resetCanvas = () => {
    paths.set({});
  };

  const render = () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    Object.keys($paths).forEach((pathId) => {
      const { points, strokeStyle, lineWidth, mode } = $paths[pathId];
      ctx.beginPath();

      ctx.strokeStyle =
        mode === 'crayon' ? crayonPatterns[strokeStyle] : strokeStyle;
      ctx.lineWidth = lineWidth;

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
      ctx.closePath();
    });
  };

  const unsubscribe = paths.subscribe(() => {
    render();
  });

  onMount(() => {
    ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  });

  onDestroy(unsubscribe);
</script>

<canvas bind:this={canvas} style:width style:height {width} {height}
  >이 브라우저는 캔버스를 지원하지 않습니다.</canvas
>
<div class="buttons">
  <button on:click={resetCanvas}>reset</button>
  <button on:click={saveDrawing}>save a drawing</button>
</div>

<style>
  canvas {
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .buttons {
    position: absolute;
    top: -40px;
    right: 0;
  }

  button {
    padding: 4px 8px;
  }
</style>
