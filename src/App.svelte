<script>
  import {
    ColorPanel,
    Toolbar,
    CanvasDraw,
    CanvasCursor,
    BrushSize,
  } from './lib/index.js';
  import { getImage } from './api/main';

  const getSearchImageLists = async (search) => {
    const result = await getImage(search);
    console.log(result.data.items);
  };
  try {
    getSearchImageLists('숫자 선잇기 도안');
  } catch (err) {
    console.error(err);
  }
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
