<script>
  export let mode = 'crayon';
  export let colorCode = '#000';
</script>

<li class="color-pick" style="fill: {colorCode}" data-color={colorCode}>
  <svg data-src="./images/crayon.svg" class:hide={mode !== 'crayon'} />
  <svg data-src="./images/marker.svg" class:hide={mode !== 'marker'} />
</li>

<style>
  li {
    cursor: pointer;
    transition: 0.2s;
  }

  li:hover {
    transform: translateX(20px);
  }

  li svg.hide {
    display: none;
  }
</style>
