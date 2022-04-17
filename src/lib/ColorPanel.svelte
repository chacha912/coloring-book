<script>
  import { onDestroy } from 'svelte';
  import { colorCode, mode } from '../store.js';
  import ColorPen from './ColorPen.svelte'
	
  let colors = [
    "#d500f9",
    "#651fff",
    "#0f2d82",
    "#3d5afe",
    "#00b8d4",
    "#05aa4a",
    "#7dea00",
    "#ffcc00",
    "#ff6d00",
    "#dd2c00",
    "#774b3b",
    "#000000",
  ]

  let panelMode = 'crayon';
  
  const setColor = (e) => {
    const target = e.target.closest('.color-pick');
    if (!target) return;

    const color = target.getAttribute('data-color');
    colorCode.set(color);
  }

  const unsubscribe = mode.subscribe(mode => {
    if (mode === 'eraser') return;

    panelMode = mode;
  });

  onDestroy(unsubscribe);
</script>

<ul on:click={setColor}>
    {#each colors as colorCode}
        <ColorPen mode={panelMode} { colorCode } />
	{/each}
</ul>

<style>
    ul {
        position: relative;
        z-index: 10;
    }
</style>
