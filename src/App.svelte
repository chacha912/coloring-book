<script>
  import {
    ColorPanel,
    Toolbar,
    CanvasDraw,
    CanvasCursor,
    BrushSize,
  } from './lib/index.js';
  import Gallery from './service/firebase.js';

  const gallery = new Gallery();
  let drawings = [];

  gallery.getDrawings((data) => {
    drawings = data;
  });
</script>

<div class="world">
  <div class="inspector">
    <ColorPanel />
    <BrushSize />
  </div>
  <div class="canvas-wrap">
    <CanvasCursor />
    <CanvasDraw {gallery} />
    <Toolbar />
  </div>
  <ul class="gallery">
    {#each drawings as drawing}
      <li>
        <img src={drawing.thumbnail} alt="masterpiece" />
      </li>
    {/each}
  </ul>
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

  .gallery {
    margin-left: 10px;
    width: 100px;
    height: 700px;
    overflow-y: auto;
  }
  .gallery li {
    margin-bottom: 10px;
    border: 1px solid lightgray;
  }
  .gallery img {
    width: 100%;
  }
</style>
