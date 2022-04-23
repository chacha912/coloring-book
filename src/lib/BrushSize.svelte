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
  <input
    type="range"
    {min}
    {max}
    value={$lineWidth[$mode]}
    name="brushSize"
    style="background-size: {$lineWidth[$mode] -
      (min * 100) / (max - min)}% 100%;"
    on:input={(e) => {
      setBrushSize(Number(e.currentTarget.value));
    }}
  />
  <button use:longpress on:longpress={handleSizeUp}>+</button>
</div>

<style>
  .control-item {
    --light-gray: #e1e1e1;
    --range-color: rgb(149, 148, 148);
    --range-thumb-color: rgb(195, 194, 194);
    display: flex;
    align-items: center;
    margin-top: 14px;
    margin-right: 4px;
    padding: 0.6em 0.4em;
    border: 1px solid var(--light-gray);
    font-size: 14px;
  }

  label {
    margin-right: 4px;
    color: #333;
  }

  input[type='number'] {
    margin-right: 4px;
    width: 30px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
  }

  input[type='number']:focus {
    outline: 1px solid rgba(123, 123, 123, 0.555);
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    background: none;
    border-radius: 100%;
    border: none;
  }

  button:hover {
    background: #ddd;
  }

  input[type='range'] {
    -webkit-appearance: none;
    width: 50px;
    height: 7px;
    background: #ddd;
    border-radius: 5px;
    background-image: linear-gradient(var(--range-color), var(--range-color));
    background-repeat: no-repeat;
  }

  /* Input Thumb */
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: var(--range-thumb-color);
    cursor: pointer;
    box-shadow: 0 0 2px 0 #555;
  }

  input[type='range']::-moz-range-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: var(--range-thumb-color);
    cursor: pointer;
    box-shadow: 0 0 2px 0 #555;
  }

  input[type='range']::-ms-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: var(--range-thumb-color);
    cursor: pointer;
    box-shadow: 0 0 2px 0 #555;
  }

  input[type='range']::-webkit-slider-thumb:hover {
    background: var(--range-color);
  }

  input[type='range']::-moz-range-thumb:hover {
    background: var(--range-color);
  }

  input[type='range']::-ms-thumb:hover {
    background: var(--range-color);
  }

  /* Input Track */
  input[type='range']::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  input[type='range']::-moz-range-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  input[type='range']::-ms-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }
</style>
