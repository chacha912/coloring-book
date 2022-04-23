<script>
  import { lineWidth } from '../store.js';

  const min = 1;
  const max = 100;
</script>

<label for="brushSize">size</label>
<input
  id="brushSize"
  type="number"
  value={$lineWidth}
  {min}
  {max}
  on:input={(e) => {
    let value = Number(e.currentTarget.value);

    value = min > value ? min : value;
    value = max < value ? max : value;
    e.currentTarget.value = '' + value;
    console.log(value);

    lineWidth.set(value);
  }}
/>
<button
  on:click={() => {
    lineWidth.update((size) => {
      const newSize = size - 1;
      return newSize < min ? min : newSize;
    });
  }}>-</button
>
<input
  type="range"
  {min}
  {max}
  value={$lineWidth}
  name="brushSize"
  on:input={(e) => {
    lineWidth.set(Number(e.currentTarget.value));
  }}
/>
<button
  on:click={() => {
    lineWidth.update((size) => {
      const newSize = size + 1;
      return newSize > max ? max : newSize;
    });
  }}>+</button
>
