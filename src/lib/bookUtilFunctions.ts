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
// this one sorts as per the titles, in ascending order
export const titleAscending = (
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

// this one sorts as per the author, in descending order
export const authorAscending = (
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
