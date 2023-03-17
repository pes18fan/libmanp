<script lang="ts">
  export let bookList: Array<Book>;
</script>

<div class="books">
  {#each bookList as book }
    <div class="book">
      {book.name} by {book.author}
    </div>
  {/each}
</div>

<style lang="scss">
  .books {
    display: flex;
    flex-direction: column;
    border: 2px solid $secondary-color;
    border-radius: 5px;
    margin: 10px;
  }
</style>
