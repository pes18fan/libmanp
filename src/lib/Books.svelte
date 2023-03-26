<script lang="ts">
  import { useClickOutside } from "@grail-ui/svelte";
  import { createMenu } from "@grail-ui/svelte";

  import type { Writable } from "svelte/store";
  import { fade } from "svelte/transition";

  import * as util from "./bookUtilFunctions";

  export let bookList: Array<Book> = [];
  export let handleBookSelect: (book: Book) => void;
  export let selectedBook: Writable<Book | undefined>;

  let searchBox: HTMLInputElement;
  let bookListElement: HTMLUListElement;

  const sortOptions = [
    { id: "alphabeticallyTitle", label: "Alphabetically (Title)" },
    { id: "alphabeticallyAuthor", label: "Alphabetically (Author)" }
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
        case "alphabeticallyTitle":
          util.titleAscending(bookList, bookListElement);
          break;
        case "alphabeticallyAuthor":
          util.authorAscending(bookList, bookListElement);
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
        <ul transition:fade use:useMenu {...$menuAttrs} class="sort-options">
          {#each sortOptions as sortOption (sortOption.id)}
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
        <li data-title={book.title} data-author={book.author}>
          <div
            class="book"
            on:click={() => handleBookSelect(book)}
            on:keydown={() => handleBookSelect(book)}
            use:useClickOutside={{ handler: () => selectedBook.set(undefined) }}
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
      width: 90%;

      input {
        @include inputStyles;
      }

      .sort-button {
        font-size: 18px;
        width: 20%;
        padding: 5px;
      }

      .sort-options {
        display: flex;
        flex-direction: column;
        background: $primary-color;
        width: auto;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid $accent-color;

        .sort-option {
          margin: 10px 0px 10px 0px;

          .sort-option-anchor {
            transition: all 300ms ease;
            padding: 10px;
            border-radius: 10px;
            text-decoration: none;
            color: #ffffffde;

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
