<script lang="ts">
  import { message } from "@tauri-apps/api/dialog";
  import { writeFile, BaseDirectory } from "@tauri-apps/api/fs";
  import { listen } from "@tauri-apps/api/event";
  import type { PageData } from "./$types";

  export let data: PageData;

  listen("about", async () => {
    await message(`
    libmanp v0.1.0
    Written by pes18fan, 2023.
    Licensed under the Unlicense.
    `);
  });

  const createFile = async () => {
    try {
      await writeFile({ path: "./lib.json", contents: "{}" }, { dir: BaseDirectory.AppData });
    } catch (error) {
      console.log(`Error creating file: ${error}`);
    }

    await message("File created! Now add books to it.");
  };
</script>

<main>
  <div class="container">
    <div class="sideInfo">
      <div class="actions">
        <h1>Actions</h1>
        {#if data.libFileExistence === false}
          <button on:click="{createFile}">Create Library File</button>
        {:else}
          <button>Add</button>
        {/if}
        <p>Select a book to pick something to do with it.</p>
      </div>
    </div>
    <div class="books" />
  </div>
</main>
