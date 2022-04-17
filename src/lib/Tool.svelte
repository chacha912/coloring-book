<script>
    export let mode = 'crayon';
    export let colorCode = undefined;
    export let selected = false;
</script>

<button class="toolbar-item" class:selected data-mode={mode} data-color={colorCode} style="fill: {colorCode}">
    {#if mode === 'crayon'}
        <svg data-src="./images/crayon-v.svg"></svg>
    {:else if mode === 'marker'}
        <svg data-src="./images/marker-v.svg"></svg>
    {:else if mode === 'eraser'}
        <svg data-src="./images/eraser-v.svg"></svg>
    {/if}
</button>

<style>
    button {
        margin: 0 4px;
        height: 100px;
        background: none;
        border: none;
        transition: 0.2s;
    }

    button:hover,
    button.selected {
        transform: translateY(-20px);
    }
</style>