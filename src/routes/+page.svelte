<script lang="ts">
  // tauri stuff
  import { message } from "@tauri-apps/api/dialog";
  import { writeFile, BaseDirectory } from "@tauri-apps/api/fs";
  import { listen, emit } from "@tauri-apps/api/event";

  import type { PageData } from "./$types";

  // for the modals
  import { createModal } from "@grail-ui/svelte";
  import { scale } from "svelte/transition";

  const { useModal, modalAttrs, titleAttrs, open } = createModal({
    portal: null,
    dismissible: true,
    keyboardDismissible: true
  });

  $open = false;

  // components
  import BookActions from "$lib/BookActions.svelte";
  import Books from "$lib/Books.svelte";

  // this data includes the lib.json file content loaded in every time the page reloads
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
  const processCreatedLibFile = async () => {
    try {
      await writeFile(
        { path: "./lib.json", contents: `{"books":[]}` },
        { dir: BaseDirectory.AppData }
      );

      data.libData = `{"books":[]}`;

      await message("File created! Now add books to it.");
    } catch (error) {
      console.log(`Error creating file: ${error}`);
      await message(`Error creating file: ${error}`);
    }
  };

  // adds a new book to the file
  const processNewBook = () => {
    $open = true;

    // emit("new-book", data.libData);
  };
</script>

<main>
  {#if $open}
    <div use:useModal transition:scale={{ duration: 300 }} {...$modalAttrs} class="addBookModal">
      <h2 {...$titleAttrs}>Add a Book</h2>
      <form class="addBookForm">
        <label for="title">Name:</label> 
        <input type="text" name="title" id="title" />
        <br />
        <label for="author">Author:</label> 
        <input type="text" name="title" id="title" />
        <button type="submit">Add</button>
      </form>
    </div>

    <div id="overlay"></div>
  {/if}

  <div class="container">
    <div class="sideInfo">
      <BookActions
        {processCreatedLibFile}
        {processNewBook}
        libData={data.libData}
      />
    </div>
    <Books />
  </div>
</main>
