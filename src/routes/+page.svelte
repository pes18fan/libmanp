<script lang="ts">
  import { message } from "@tauri-apps/api/dialog";
  import { writeFile, BaseDirectory } from "@tauri-apps/api/fs";
  import { listen } from "@tauri-apps/api/event";
  import type { PageData } from "./$types";

  export let data: PageData;

  // listener to show info about the app when the About button in app menu is pressed
  listen("about", async () => {
    await message(`
    libmanp v0.1.0
    Written by pes18fan, 2023.
    Licensed under the Unlicense.
    `);
  });

  // attempts to create json file for storing book data if it does not exist
  const createFile = async () => {
    try {
      await writeFile(
        { path: "./lib.json", contents: "{ \"books\": [] }" },
        { dir: BaseDirectory.AppData }
      );

      data.libFileExistence = true;

      await message("File created! Now add books to it.");
    } catch (error) {
      console.log(`Error creating file: ${error}`);
    }
  };
</script>

<main>
  <div class="container">
    <div class="sideInfo">
      <div class="actions">
        <h1>Actions</h1>
        <!-- if else block to show show different buttons depending on whether the lib.json file exists -->
        {#if data.libFileExistence === false}
          <button on:click={createFile}>Create Library File</button>
        {:else}
          <button>Add</button>
        {/if}
        <p>Select a book to pick something to do with it.</p>
      </div>
    </div>
    <div class="books" />
  </div>
</main>
