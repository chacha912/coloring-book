<script>
  import { getImage } from '../api/main';
  import { imgLists } from '../store.js';

  let searchInput;

  const getSearchImageLists = async (query) => {
    const result = await getImage(query);
    console.log(result.data.items);
    imgLists.set(result.data.items);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchInput.value;
    await getSearchImageLists(query);
  };
</script>

<form on:submit={handleSearch}>
  <input bind:this={searchInput} type="text" />
  <button type="submit">검색</button>
</form>
<ul class="img-lists">
  {#each $imgLists as imgList}
    <li class="img-list">
      <img src={imgList.thumbnail} alt={imgList.title} />
    </li>
  {/each}
</ul>

<style>
  input {
    margin-right: 4px;
    padding: 0.4em 0.8em;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  input:focus {
    outline: 1px solid rgba(123, 123, 123, 0.2);
  }

  .img-lists {
    background: #f1f1f1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 10px;
    width: 300px;
    height: 700px;
    overflow-y: scroll;
  }

  .img-list {
    width: 48%;
  }

  img {
    width: 100%;
  }
</style>
