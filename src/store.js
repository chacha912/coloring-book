import { writable } from 'svelte/store';

const initialBrushSize = 10;

export const mode = writable('crayon');
export const lineWidth = writable({
  marker: initialBrushSize,
  crayon: initialBrushSize,
  eraser: initialBrushSize,
});
export const colorCode = writable('#000');
export const paths = writable({});
