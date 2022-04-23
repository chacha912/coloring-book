<script>
  import {
    ColorPanel,
    Toolbar,
    CanvasDraw,
    CanvasCursor,
    BrushSize,
  } from './lib/index.js';
</script>

<div class="world">
  <div class="inspector">
    <ColorPanel />
    <BrushSize />
  </div>
  <div class="canvas-wrap">
    <CanvasCursor />
    <CanvasDraw />
  </div>
  <Toolbar />
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
