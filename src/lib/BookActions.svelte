<script lang="ts">
  import type { Writable } from "svelte/store";

  export let newBookInit: () => void;
  export let selectedBook: Writable<Book | undefined>;

  $: selectedBookValue = $selectedBook;
</script>

<div class="actions">
  <h1>Actions</h1>
  {#if selectedBookValue === undefined}
    <button on:click={newBookInit}>Add</button>
    <p>Select a book to pick something to do with it.</p>
  {:else}
    <h2>{selectedBookValue.title}</h2>
    <button>Edit</button>
    <button>Delete</button>
  {/if}
</div>

<style lang="scss">
  .actions {
    border: 2px solid $secondary-color;
    border-radius: 5px;
    margin: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
</style>
