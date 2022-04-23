<script>
  import { lineWidth, mode } from '../store.js';

  const min = 1;
  const max = 100;

  const setBrushSize = (newSize) => {
    lineWidth.update((sizes) => {
      return { ...sizes, [$mode]: newSize };
    });
  };
</script>

<label for="brushSize">size</label>
<input
  id="brushSize"
  type="number"
  value={$lineWidth[$mode]}
  {min}
  {max}
  on:input={(e) => {
    let value = Number(e.currentTarget.value);

    value = min > value ? min : value;
    value = max < value ? max : value;
    e.currentTarget.value = '' + value;
    console.log(value);

    setBrushSize(value);
  }}
/>
<button
  on:click={() => {
    const newSize = $lineWidth[$mode] - 1;
    setBrushSize(newSize < min ? min : newSize);
  }}>-</button
>
<input
  type="range"
  {min}
  {max}
  value={$lineWidth[$mode]}
  name="brushSize"
  on:input={(e) => {
    setBrushSize(Number(e.currentTarget.value));
  }}
/>
<button
  on:click={() => {
    const newSize = $lineWidth[$mode] + 1;
    setBrushSize(newSize > max ? max : newSize);
  }}>+</button
>
