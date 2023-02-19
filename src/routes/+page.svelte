<script lang="ts">
  import { message } from "@tauri-apps/api/dialog";
  import { listen } from "@tauri-apps/api/event";

  listen("about", async () => {
    await message(`
    libmanp v0.1.0
    Written by pes18fan, 2023.
    Licensed under the Unlicense.
    `);
  });
</script>

<main>
  <div class="container">
    <div class="sideInfo">
      <div class="actions">
        <h1>Actions</h1>
        <button>Add</button>
        <p>Select a book to pick something to do with it.</p>
      </div>
    </div>
    <div class="books" />
  </div>
</main>
