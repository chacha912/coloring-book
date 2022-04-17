import { writable } from 'svelte/store';

export const mode = writable('crayon');
export const lineWidth = writable(10);
export const colorCode = writable('#000');
export const paths = writable({});
