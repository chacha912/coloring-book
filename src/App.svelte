<script>
  import {
    ColorPanel,
    Toolbar,
    CanvasDraw,
    CanvasCursor,
    BrushSize,
    Search,
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
    <Toolbar />
  </div>
  <div class="search">
    <Search />
  </div>
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
