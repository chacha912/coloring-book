<script>
  export let drawingRepo;

  let drawings = [];
  drawingRepo.getDrawings((data) => {
    drawings = data;
  });

  const deleteDrawing = async (e) => {
    const drawingID = e.target.parentElement.dataset.id;
    await drawingRepo.deleteDrawing(drawingID);
  };
</script>

<ul class="gallery">
  {#each drawings as drawing}
    <li data-id={drawing.id}>
      <img src={drawing.thumbnail} alt="masterpiece" />
      <button class="delete_btn" on:click={deleteDrawing}>x</button>
    </li>
  {/each}
</ul>

<style>
  .gallery {
    margin-left: 10px;
    width: 100px;
    height: 700px;
    overflow-y: auto;
  }
  li {
    position: relative;
    margin-bottom: 10px;
    border: 1px solid lightgray;
    cursor: pointer;
  }
  img {
    width: 100%;
  }
  .delete_btn {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
  }
  li:hover > .delete_btn {
    display: block;
  }
</style>
