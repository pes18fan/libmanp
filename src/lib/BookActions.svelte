<script lang="ts">
  import type { Writable } from "svelte/store";

  export let handleBookCreate: () => void;
  export let handleBookEdit: () => void;
  export let handleBookAnnihilate: () => void;
  export let selectedBook: Writable<Book | undefined>;

  $: selectedBookValue = $selectedBook;
</script>

<div class="actions">
  <h1>Actions</h1>
  {#if selectedBookValue === undefined}
    <button on:click={handleBookCreate}>Add</button>
    <p>Select a book to pick something to do with it.</p>
  {:else}
    <h2>{selectedBookValue.title}</h2>
    <button on:click={handleBookEdit}>Edit</button>
    <button on:click={handleBookAnnihilate}>Delete</button>
  {/if}
</div>

<style lang="scss">
  .actions {
    overflow: auto;
    border: 2px solid $accent-color;
    border-radius: 5px;
    margin: 10px;
    padding: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1, h2, p {
      margin: 10px;
    }

    button {
      padding: 20px;
    }
  }
</style>
