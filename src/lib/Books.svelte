<script lang="ts">
  export let bookList: Array<Book>;
</script>

<div class="books">
  {#each bookList as book }
    <div class="book">
      {book.title} by {book.author}
    </div>
  {/each}
</div>

<style lang="scss">
  .books {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid $secondary-color;
    border-radius: 5px;
    margin: 10px;
  }

  .book {
    transition: all 300ms ease;
    background-color: $accent-color;
    border-radius: 5px;
    margin: 8px;
    padding: 10px;
    width: 90%;

    &:hover {
      background-color: $accent-color-hover;
    }
  }
</style>
