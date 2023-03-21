<script lang="ts">
  import { onMount } from "svelte";


  export let bookList: Array<Book> = [];
  export let handleBookSelect: (book: Book) => void;

  let searchBox: HTMLInputElement;
  let bookListElement: HTMLUListElement;

  const searchBooks = () => {
    if (bookList.length === 0) return;

    const bookElements = bookListElement.getElementsByTagName("li");
    const filter = searchBox.value.toUpperCase();

    for (let i = 0; i < bookElements.length; i++) {
      let currentBookDiv = bookElements[i].getElementsByTagName("div")[0];

      if (currentBookDiv.innerHTML !== "") {
        if (currentBookDiv.textContent!.toUpperCase().indexOf(filter) > -1) {
          bookElements[i].style.display = "";
        } else {
          bookElements[i].style.display = "none";
        }
      }
    }
  };
</script>

<div class="books">
  <h1>Books</h1>
  {#if bookList.length !== 0}
    <input
      bind:this={searchBox}
      placeholder="Look for a book..."
      on:keyup={searchBooks}
    />
    <ul bind:this={bookListElement}>
      {#each bookList as book}
        <li>
          <div
            class="book"
            on:click={() => handleBookSelect(book)}
            on:keydown={() => handleBookSelect(book)}
          >
            {book.title} by {book.author}
          </div>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No books. Add some!</p>
  {/if}
</div>

<style lang="scss">
  .books {
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid $secondary-color;
    border-radius: 5px;
    margin: 10px;

    h1, p {
      margin: 10px;
    }

    input {
      @include inputStyles;
    }

    ul {
      list-style-type: none;
      height: min-content;
      width: 90%;

      .book {
        transition: all 300ms ease;
        background-color: $accent-color;
        border-radius: 5px;
        margin: 10px;
        padding: 10px;

        &:hover {
          background-color: $accent-color-hover;
        }
      }
    }
  }
</style>
