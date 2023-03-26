/* eslint-disable @typescript-eslint/no-non-null-assertion */
// function to search through the book list
export const searchBooks = (
  searchBox: HTMLInputElement,
  bookList: Array<Book>,
  bookListElement: HTMLUListElement
) => {
  if (bookList.length === 0) return;

  const bookElements = bookListElement.getElementsByTagName("li");
  const filter = searchBox.value.toUpperCase();

  for (let i = 0; i < bookElements.length; i++) {
    const currentBookDiv = bookElements[i].getElementsByTagName("div")[0];

    if (currentBookDiv.innerHTML !== "") {
      if (currentBookDiv.textContent!.toUpperCase().indexOf(filter) > -1) {
        bookElements[i].style.display = "";
      } else {
        bookElements[i].style.display = "none";
      }
    }
  }
};

// SORTING FUNCTIONS

// Ascending Order
// sorts as per the titles
export const sortByTitleAscending = (
  bookList: Array<Book>,
  bookListElement: HTMLUListElement
) => {
  if (bookList.length === 0) return;

  const bookElements = bookListElement.getElementsByTagName("li");
  let switching = true;
  let shouldSwitch = false;
  let i: number;

  while (switching) {
    switching = false;

    for (i = 0; i < bookElements.length - 1; i++) {
      shouldSwitch = false;

      if (
        bookElements[i].dataset.title!.toUpperCase() >
        bookElements[i + 1].dataset.title!.toUpperCase()
      ) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      bookElements[i].parentNode?.insertBefore(
        bookElements[i + 1],
        bookElements[i]
      );
      switching = true;
    }
  }
};

// sorts as per the author
export const sortByAuthorAscending = (
  bookList: Array<Book>,
  bookListElement: HTMLUListElement
) => {
  if (bookList.length === 0) return;

  const bookElements = bookListElement.getElementsByTagName("li");
  let switching = true;
  let shouldSwitch = false;
  let i: number;

  while (switching) {
    switching = false;

    for (i = 0; i < bookElements.length - 1; i++) {
      shouldSwitch = false;

      if (
        bookElements[i].dataset.author!.toUpperCase() >
        bookElements[i + 1].dataset.author!.toUpperCase()
      ) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      bookElements[i].parentNode?.insertBefore(
        bookElements[i + 1],
        bookElements[i]
      );
      switching = true;
    }
  }
};

// this one sorts as per the date added
export const sortByDateAddedAscending = (
  bookList: Array<Book>,
  bookListElement: HTMLUListElement
) => {
  if (bookList.length === 0) return;

  const bookElements = bookListElement.getElementsByTagName("li");
  let switching = true;
  let shouldSwitch = false;
  let i: number;

  while (switching) {
    switching = false;

    for (i = 0; i < bookElements.length - 1; i++) {
      shouldSwitch = false;

      if (
        Date.parse(bookElements[i].dataset.dateadded!) >
        Date.parse(bookElements[i + 1].dataset.dateadded!)
      ) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      bookElements[i].parentNode?.insertBefore(
        bookElements[i + 1],
        bookElements[i]
      );
      switching = true;
    }
  }
};

// Descending Order
// sorts as per the titles
export const sortByTitleDescending = (
  bookList: Array<Book>,
  bookListElement: HTMLUListElement
) => {
  if (bookList.length === 0) return;

  const bookElements = bookListElement.getElementsByTagName("li");
  let switching = true;
  let shouldSwitch = false;
  let i: number;

  while (switching) {
    switching = false;

    for (i = 0; i < bookElements.length - 1; i++) {
      shouldSwitch = false;

      if (
        bookElements[i].dataset.title!.toUpperCase() <
        bookElements[i + 1].dataset.title!.toUpperCase()
      ) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      bookElements[i].parentNode?.insertBefore(
        bookElements[i + 1],
        bookElements[i]
      );
      switching = true;
    }
  }
};

// sorts as per the author
export const sortByAuthorDescending = (
  bookList: Array<Book>,
  bookListElement: HTMLUListElement
) => {
  if (bookList.length === 0) return;

  const bookElements = bookListElement.getElementsByTagName("li");
  let switching = true;
  let shouldSwitch = false;
  let i: number;

  while (switching) {
    switching = false;

    for (i = 0; i < bookElements.length - 1; i++) {
      shouldSwitch = false;

      if (
        bookElements[i].dataset.author!.toUpperCase() <
        bookElements[i + 1].dataset.author!.toUpperCase()
      ) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      bookElements[i].parentNode?.insertBefore(
        bookElements[i + 1],
        bookElements[i]
      );
      switching = true;
    }
  }
};

// this one sorts as per the date added
export const sortByDateAddedDescending = (
  bookList: Array<Book>,
  bookListElement: HTMLUListElement
) => {
  if (bookList.length === 0) return;

  const bookElements = bookListElement.getElementsByTagName("li");
  let switching = true;
  let shouldSwitch = false;
  let i: number;

  while (switching) {
    switching = false;

    for (i = 0; i < bookElements.length - 1; i++) {
      shouldSwitch = false;

      if (
        Date.parse(bookElements[i].dataset.dateadded!) <
        Date.parse(bookElements[i + 1].dataset.dateadded!)
      ) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      bookElements[i].parentNode?.insertBefore(
        bookElements[i + 1],
        bookElements[i]
      );
      switching = true;
    }
  }
};
