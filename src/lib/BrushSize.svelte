<script>
  import { lineWidth, mode } from '../store.js';
  import { longpress } from '../util/longpress.js';

  const min = 1;
  const max = 100;

  const setBrushSize = (newSize) => {
    lineWidth.update((sizes) => {
      return { ...sizes, [$mode]: newSize };
    });
  };

  const handleSizeDown = () => {
    const newSize = $lineWidth[$mode] - 1;
    setBrushSize(newSize < min ? min : newSize);
  };

  const handleSizeUp = () => {
    const newSize = $lineWidth[$mode] + 1;
    setBrushSize(newSize > max ? max : newSize);
  };
</script>

<div class="control-item">
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

      setBrushSize(value);
    }}
  />
  <button use:longpress on:longpress={handleSizeDown}>-</button>
  <input type="range" {min} {max} value={$lineWidth[$mode]} name="brushSize" />
  <button use:longpress on:longpress={handleSizeUp}>+</button>
</div>
