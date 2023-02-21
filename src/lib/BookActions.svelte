<script lang="ts">
  export let processCreatedLibFile: () => Promise<void>;
  export let processNewBook: () => void;
  export let libData: string;
</script>

<div class="actions">
  <h1>Actions</h1>
  <!-- if else block to show show different buttons depending on whether the lib.json file exists -->
  {#if libData === "N/A"}
    <button on:click={processCreatedLibFile}>Create Library File</button>
    <p>Create a library file to start managing books.</p>
  {:else}
    <button on:click={processNewBook}>Add</button>
    <p>Select a book to pick something to do with it.</p>
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/global" as *;

  .actions {
    border: 2px solid $secondary-color;
    border-radius: 5px;
    margin: 10px;
    text-align: center;
    display: grid;
    grid-template-columns: 1, 1fr;
  }
</style>
