<script>
  import { onDestroy } from 'svelte';
  import { colorCode, mode } from '../store.js';
  import { colors } from '../util/util.js';
  import ColorPen from './ColorPen.svelte';

  let panelMode = 'crayon';

  const setColor = (e) => {
    const target = e.target.closest('.color-pick');
    if (!target) return;

    const color = target.getAttribute('data-color');
    colorCode.set(color);
  };

  const unsubscribe = mode.subscribe((mode) => {
    if (mode === 'eraser') return;

    panelMode = mode;
  });

  onDestroy(unsubscribe);
</script>

<ul on:click={setColor}>
  {#each colors as colorCode}
    <ColorPen mode={panelMode} {colorCode} />
  {/each}
</ul>

<style>
  ul {
    position: relative;
    z-index: 10;
  }
</style>
