<script lang="ts">
  // tauri stuff
  import { appWindow } from "@tauri-apps/api/window";
  import { message } from "@tauri-apps/api/dialog";
  import {
    writeFile,
    readTextFile,
    exists,
    BaseDirectory
  } from "@tauri-apps/api/fs";
  import { listen } from "@tauri-apps/api/event";
  import { invoke } from "@tauri-apps/api/tauri";
  import { appDataDir } from "@tauri-apps/api/path";

  import { onMount } from "svelte";

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
  let existingJson = "";
  let bookList: Array<Book> = [];
  let addBookForm: HTMLFormElement;

  /**
   * this functions runs as soon as the app begins
   * it attempts to fetch the data for the library from a file called lib.json
   * if that file doesn't exist, it creates it with one `"books"` field that has the value of an empty array, and fetches that data
   */
  const fetchLib = async () => {
    try {
      const fileData = (await exists("lib.json", {
        dir: BaseDirectory.AppData
      }))
        ? await readTextFile("lib.json", { dir: BaseDirectory.AppData })
        : `{"books":[]}`;

      if (fileData === `{"books":[]}`) {
        try {
          await writeFile(
            { path: "./lib.json", contents: fileData },
            { dir: BaseDirectory.AppData }
          );

          existingJson = fileData;
        } catch (error) {
          console.log(`Error creating file: ${error}`);
          await message(`Error creating file: ${error}`);
        }
      }

      const libData: Library = JSON.parse(fileData);

      bookList = libData.books || [];
      existingJson = fileData;
      console.log(`current JSON data: ${existingJson}`);
    } catch (error) {
      console.error(`Error fetching library file: ${error}`);
    }
  };

  onMount(async () => {
    try {
      fetchLib();

      const appDataDirPath = await appDataDir();

      invoke("watch", { window: appWindow, filePath: appDataDirPath });

      listen("file-change", () => {
        console.log("File watch event recieved!");
        fetchLib();
      })
    } catch (error) {
      console.error(`Error while watching library file for changes: ${error}`);
    }
  });

  // listener to show info about the app when the About button in app menu is pressed
  listen("about", async () => {
    await message(`
    libmanp v0.1.0
    Written by pes18fan, 2023.
    Licensed under the GNU General Public License 3.0.
    `);
  });

  // adds a new book to the file
  const newBookInit = () => {
    $open = true;
  };

  // sends the data for the new book to be added to the backend after the add button in the modal is pressed
  const processNewBook = async () => {
    $open = false;

    const formData = new FormData(addBookForm);
    console.log((Object.fromEntries(formData.entries())));

    const appDataDirPath = await appDataDir();
    const libraryPath = appDataDirPath.concat("lib.json");

    invoke("add_new_book", {
      existingJson,
      filePath: libraryPath,
      bookData: Object.fromEntries(formData.entries())
    })
      .then(() => console.log("Book added successfully"))
      .catch((error) => console.error("Error adding book", error));
  };
</script>

<main>
  {#if $open}
    <div
      use:useModal
      transition:scale={{ duration: 300 }}
      {...$modalAttrs}
      class="addBookModal"
    >
      <h2 {...$titleAttrs}>Add a Book</h2>
      <form bind:this={addBookForm} class="addBookForm">
        <label for="title">Name:</label>
        <input type="text" name="title" id="title" />
        <br />
        <label for="author">Author:</label>
        <input type="text" name="author" id="author" />
        <button on:click={processNewBook}>Add</button>
      </form>
    </div>

    <div id="overlay" />
  {/if}

  <div class="container">
    <div class="sideInfo">
      <BookActions {newBookInit} />
    </div>
    <Books {bookList} />
  </div>
</main>
