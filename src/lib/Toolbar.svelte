<script>
  import { onDestroy } from 'svelte';
  import { colorCode, mode } from '../store.js';
  import Tool from './Tool.svelte';

  let colors = {
    marker: '#000000',
    crayon: '#000000',
  };

  const setTool = (e) => {
    const target = e.target.closest('.toolbar-item');
    if (!target) return;

    const newMode = target.getAttribute('data-mode');
    if ($mode === newMode) return;

    mode.set(newMode);
    colorCode.set(target.getAttribute('data-color'));
  };

  const unsubscribe = colorCode.subscribe((color) => {
    colors[$mode] = color;
  });

  onDestroy(unsubscribe);
</script>

<div class="toolbar" on:click={setTool}>
  <Tool mode="marker" colorCode={colors.marker} selected={$mode === 'marker'} />
  <Tool mode="crayon" colorCode={colors.crayon} selected={$mode === 'crayon'} />
  <Tool mode="eraser" selected={$mode === 'eraser'} />
</div>

<style>
  .toolbar {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: flex-end;
    height: 120px;
    bottom: -120px;
    overflow: hidden;
  }
</style>
