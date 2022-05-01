<script>
  import { getImage } from '../api/main';
  import { imgLists } from '../store.js';

  let searchInput;
  let query;

  const getSearchImageLists = async (query) => {
    const result = await getImage(query);
    imgLists.set(result.data.items);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    query = searchInput.value;
    await getSearchImageLists(query);
  };

  const handleClickSearchHint = async (e) => {
    const target = e.target.closest('.search-hint');
    if (!target) return;

    const targetButton = target.querySelector('button');

    if (targetButton.textContent === query) return;

    query = targetButton.textContent;
    document
      .querySelector('.search-hint button.select')
      ?.classList.remove('select');
    targetButton.classList.add('select');

    searchInput.value = query;
    await getSearchImageLists(query);
  };
</script>

<form on:submit={handleSearch}>
  <input bind:this={searchInput} type="text" />
  <button type="submit">검색</button>
</form>
<ul class="search-hint-list" on:click={handleClickSearchHint}>
  <li class="search-hint">
    <button>숫자 선잇기</button>
  </li>
  <li class="search-hint">
    <button>미로찾기</button>
  </li>
  <li class="search-hint">
    <button>색칠공부</button>
  </li>
  <li class="search-hint">
    <button>숨은그림찾기</button>
  </li>
</ul>
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

  .search-hint-list {
    display: flex;
    margin: 10px 0 20px;
  }

  .search-hint {
    margin: 0 3px;
  }

  .search-hint button {
    padding: 0.4em 0.6em;
    background: #f1f1f1;
    border: none;
    border-radius: 20px;
    font-size: 13px;
  }

  .search-hint button:hover {
    background: #e2e4e5;
  }

  .search-hint button:global(.select) {
    background: #e2e4e5 !important;
  }

  .img-lists {
    background: #f1f1f1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 10px;
    width: 300px;
    height: 600px;
    overflow-y: scroll;
  }

  .img-list {
    width: 48%;
  }

  img {
    width: 100%;
  }
</style>
