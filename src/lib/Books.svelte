<script lang="ts">
  import { createMenu } from "@grail-ui/svelte";

  import { slide } from "svelte/transition";

  import * as util from "./bookUtilFunctions";

  export let bookList: Array<Book> = [];
  export let handleBookSelect: (book: Book) => void;

  let searchBox: HTMLInputElement;
  let bookListElement: HTMLUListElement;

  const sortOptionsAscending = [
    { id: "titleAsc", label: "Title" },
    { id: "authorAsc", label: "Author" },
    { id: "dateAddedAsc", label: "Date Added" }
  ];

  const sortOptionsDescending = [
    { id: "titleDesc", label: "Title" },
    { id: "authorDesc", label: "Author" },
    { id: "dateAddedDesc", label: "Date Added" }
  ];

  // for the sort menu
  const {
    useTrigger,
    triggerAttrs: menuTriggerAttrs,
    useMenu,
    menuAttrs,
    itemAttrs: menuItemAttrs,
    open
  } = createMenu({
    positioning: {
      strategy: "fixed",
      placement: "bottom"
    },
    onSelect(id) {
      $open = false;

      switch (id) {
        // ascending
        case "titleAsc":
          util.sortByTitleAscending(bookList, bookListElement);
          break;
        case "authorAsc":
          util.sortByAuthorAscending(bookList, bookListElement);
          break;
        case "dateAddedAsc":
          util.sortByDateAddedAscending(bookList, bookListElement);
          break;

        // descending
        case "titleDesc":
          util.sortByTitleDescending(bookList, bookListElement);
          break;
        case "authorDesc":
          util.sortByAuthorDescending(bookList, bookListElement);
          break;
        case "dateAddedDesc":
          util.sortByDateAddedDescending(bookList, bookListElement);
          break;
      }
    }
  });
</script>

<div class="books">
  <h1>Books</h1>
  {#if bookList.length !== 0}
    <div class="book-list-actions">
      <input
        bind:this={searchBox}
        placeholder="Look for a book..."
        on:keyup={() => util.searchBooks(searchBox, bookList, bookListElement)}
      />
      <button class="sort-button" use:useTrigger {...$menuTriggerAttrs}
        >Sort</button
      >

      {#if $open}
        <ul transition:slide use:useMenu {...$menuAttrs} class="sort-options">
          <li class="menu-title">
            <span>Ascending</span>
          </li>
          {#each sortOptionsAscending as sortOption (sortOption.id)}
            <li class="sort-option">
              <a
                class="sort-option-anchor"
                href="/"
                {...$menuItemAttrs(sortOption.id)}>{sortOption.label}</a
              >
            </li>
          {/each}
          <li class="menu-title">
            <span>Descending</span>
          </li>
          {#each sortOptionsDescending as sortOption (sortOption.id)}
            <li class="sort-option">
              <a
                class="sort-option-anchor"
                href="/"
                {...$menuItemAttrs(sortOption.id)}>{sortOption.label}</a
              >
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <ul bind:this={bookListElement}>
      {#each bookList as book}
        <li
          data-title={book.title}
          data-author={book.author}
          data-dateadded={book.date_added}
          transition:slide
        >
          <div
            class="book"
            on:click={() => handleBookSelect(book)}
            on:keydown={() => handleBookSelect(book)}
          >
            {book.title}
            <br />
            <span class="label">Author: </span>{book.author}
            <br />
            <span class="label">Added: </span>{new Date(
              book.date_added
            ).toLocaleDateString()}
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
    border: 2px solid $accent-color;
    border-radius: 5px;
    margin: 10px;

    h1,
    p {
      margin: 10px;
    }

    .book-list-actions {
      display: flex;
      align-items: center;
      width: 90%;

      input {
        @include inputStyles;

        &::placeholder {
          color: #dadadade;
        }
      }

      .sort-button {
        font-size: 18px;
        width: 20%;
        padding: 5px;
      }

      .sort-options {
        display: flex;
        flex-direction: column;
        text-align: center;
        background: #161616e1;
        width: auto;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid $accent-color;

        .menu-title {
          font-size: 14px;
          padding: 0px 10px 0px 10px;
          color: #d0d0d0de;
          margin: 15px 5px 15px 5px;
        }

        .sort-option {
          margin: 10px 5px 10px 5px;
          font-size: 18px;

          .sort-option-anchor {
            transition: all 300ms ease;
            padding: 10px;
            border-radius: 10px;
            text-decoration: none;
            color: #ffffffde;
            width: 80%;

            &:hover {
              background-color: $secondary-color;
            }
          }
        }
      }
    }

    ul {
      list-style-type: none;
      height: min-content;
      width: 90%;

      .book {
        transition: all 300ms ease;
        background-color: $secondary-color;
        border-radius: 5px;
        margin: 10px;
        padding: 10px;
        text-align: justify;
        letter-spacing: 1px;

        &:hover {
          background-color: $secondary-color-hover;
        }

        .label {
          color: $accent-color;
        }
      }
    }
  }
</style>
