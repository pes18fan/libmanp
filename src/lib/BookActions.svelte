<script lang="ts">
  export let newBookInit: () => void;
</script>

<div class="actions">
  <h1>Actions</h1>
    <button on:click={newBookInit}>Add</button>
    <p>Select a book to pick something to do with it.</p>
</div>

<style lang="scss">
  .actions {
    border: 2px solid $secondary-color;
    border-radius: 5px;
    margin: 10px;
    text-align: center;
    display: grid;
    grid-template-columns: 1, 1fr;
  }
</style>
