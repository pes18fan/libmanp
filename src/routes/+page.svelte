<script lang="ts">
  // tauri stuff
  import { appWindow } from "@tauri-apps/api/window";
  import { message } from "@tauri-apps/api/dialog";
  import {
    writeFile,
    readTextFile,
    createDir,
    exists,
    BaseDirectory
  } from "@tauri-apps/api/fs";
  import { listen } from "@tauri-apps/api/event";
  import { invoke } from "@tauri-apps/api/tauri";
  import { appDataDir } from "@tauri-apps/api/path";

  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";

  // components
  import BookActions from "$lib/BookActions.svelte";
  import Books from "$lib/Books.svelte";
  import Groups from "$lib/Groups.svelte";

  // for the modals
  import { createModal } from "@grail-ui/svelte";
  import { scale } from "svelte/transition";

  const {
    useModal: useNewBookModal,
    modalAttrs: newBookModalAttrs,
    titleAttrs: newBookTitleAttrs,
    open: newBookModalOpen
  } = createModal({
    portal: null,
    dismissible: true,
    keyboardDismissible: true
  });

  $newBookModalOpen = false;

  const {
    useModal: useEditBookModal,
    modalAttrs: editBookModalAttrs,
    titleAttrs: editBookTitleAttrs,
    open: editBookModalOpen
  } = createModal({
    portal: null,
    dismissible: true,
    keyboardDismissible: true
  });

  $editBookModalOpen = false;

  // this data includes the lib.json file content loaded in every time the page reloads
  let existingJson = "";
  let bookList: Array<Book> = [];

  // form elements for the various crud actions
  let addBookForm: HTMLFormElement;
  let editBookForm: HTMLFormElement;

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
            { path: "lib.json", contents: fileData },
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
    if ((await exists(await appDataDir())) === false) {
      await createDir(await appDataDir());
    }

    try {
      fetchLib();

      const appDataDirPath = await appDataDir();

      invoke("watch", { window: appWindow, filePath: appDataDirPath });

      listen("file-change", () => {
        console.log("File watch event recieved!");
        fetchLib();
      });
    } catch (error) {
      console.error(`Error while watching library file for changes: ${error}`);
    }

    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });

  const selectedBook: Writable<Book | undefined> = writable();

  $: selectedBookValue = $selectedBook;

  const handleBookSelect = (book: Book) => {
    selectedBook.set(book);
  };

  const handleBookDeselect = (event: MouseEvent) => {
    const clickedBook = (event.target as Element)?.closest(".book");
    const clickedModal = (event.target as Element)?.closest(".modal");
    const clickedButton = (event.target as Element)?.closest("button");

    if (!clickedBook && !clickedModal && !clickedButton) {
      selectedBook.set(undefined);
    }
  };

  // opens the book creation modal
  const handleBookCreate = () => {
    $newBookModalOpen = true;
  };

  // sends the data for the new book to be added to the backend after the add button in the modal is pressed
  const processNewBook = async (event: Event) => {
    event.preventDefault();

    const formData = new FormData(addBookForm);
    const bookData = {
      ...Object.fromEntries(formData.entries()),
      date_added: new Date().toISOString()
    } as Book;

    if (bookData.title === "" || bookData.author === "") {
      message("title and/or author must not be empty!", { type: "error" });
      return;
    }

    $newBookModalOpen = false;

    const appDataDirPath = await appDataDir();
    const libraryPath = appDataDirPath.concat("lib.json");

    invoke("add_book", {
      existingJson,
      filePath: libraryPath,
      bookData
    })
      .then(() => {
        console.log("Book edited successfully!");
        selectedBook.set(undefined);
      })
      .catch(async (error) => {
        await message(`Error adding book: ${error}`, { type: "error" });
      });
  };

  const handleBookEdit = () => {
    $editBookModalOpen = true;
  };

  const processEditBook = async (event: Event) => {
    event.preventDefault();

    const formData = new FormData(editBookForm);
    const newBookData = {
      ...Object.fromEntries(formData.entries()),
      date_added: new Date().toISOString()
    } as Book;

    if (newBookData.title === "" || newBookData.author === "") {
      message("title and/or author must not be empty!", { type: "error" });
      return;
    }

    $editBookModalOpen = false;

    const appDataDirPath = await appDataDir();
    const libraryPath = appDataDirPath.concat("lib.json");

    invoke("edit_book", {
      existingJson,
      filePath: libraryPath,
      oldBookData: selectedBookValue!,
      newBookData
    })
      .then(() => {
        console.log("Book edited successfully!");
        selectedBook.set(undefined);
      })
      .catch(async (error) => {
        await message(`Error editing book: ${error}`, { type: "error" });
      });
  };

  const handleBookAnnihilate = async () => {
    const appDataDirPath = await appDataDir();
    const libraryPath = appDataDirPath.concat("lib.json");

    invoke("annihilate_book", {
      existingJson,
      filePath: libraryPath,
      bookData: selectedBookValue!
    })
      .then(() => {
        console.log("Book deleted successfully!");
        selectedBook.set(undefined);
      })
      .catch(async (error) => {
        await message(`Error adding book: ${error}`, { type: "error" });
      });
  };
</script>

<!-- to deselect a book in the UI -->
<svelte:body on:click={handleBookDeselect} />

<main>
  {#if $newBookModalOpen}
    <div
      use:useNewBookModal
      transition:scale={{ duration: 300 }}
      {...$newBookModalAttrs}
      class="modal"
    >
      <h2 {...$newBookTitleAttrs}>Add a Book</h2>
      <form bind:this={addBookForm} class="addBookForm">
        <label for="title">Name:</label>
        <input type="text" name="title" id="title" required />
        <br />
        <label for="author">Author:</label>
        <input type="text" name="author" id="author" required />
        <input type="hidden" name="uid" value="#" />
        <button type="submit" on:click={processNewBook}>Add</button>
      </form>
    </div>

    <div id="overlay" />
  {/if}

  {#if $editBookModalOpen}
    <div
      use:useEditBookModal
      transition:scale={{ duration: 300 }}
      {...$editBookModalAttrs}
      class="modal"
    >
      <h2 {...$editBookTitleAttrs}>Edit {selectedBookValue?.title}</h2>
      <form bind:this={editBookForm} class="editBookForm">
        <label for="title">Name:</label>
        <input
          type="text"
          name="title"
          value={selectedBookValue?.title}
          id="title"
        />
        <br />
        <label for="author">Author:</label>
        <input
          type="text"
          name="author"
          value={selectedBookValue?.author}
          id="author"
        />
        <input type="hidden" name="uid" value={selectedBookValue?.uid} />
        <button type="submit" on:click={processEditBook}>Add</button>
      </form>
    </div>

    <div id="overlay" />
  {/if}

  <div class="container">
    <div class="sideInfo">
      <BookActions
        {handleBookCreate}
        {handleBookEdit}
        {handleBookAnnihilate}
        {selectedBook}
      />
      <Groups />
    </div>
    <Books {bookList} {handleBookSelect} />
  </div>
</main>
