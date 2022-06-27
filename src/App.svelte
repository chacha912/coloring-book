<script>
  import {
    ColorPanel,
    Toolbar,
    CanvasDraw,
    CanvasCursor,
    BrushSize,
    Gallery,
  } from './lib/index.js';
  import DrawingRepository from './service/firebase.js';

  const drawingRepo = new DrawingRepository();
</script>

<div class="world">
  <div class="inspector">
    <ColorPanel />
    <BrushSize />
  </div>
  <div class="canvas-wrap">
    <CanvasCursor />
    <CanvasDraw {drawingRepo} />
    <Toolbar />
  </div>
  <Gallery {drawingRepo} />
</div>

<style>
  .world {
    position: relative;
    display: flex;
    align-items: center;
  }

  .canvas-wrap {
    position: relative;
  }
</style>
