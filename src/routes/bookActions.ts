// this file is for handling the various actions of book management, like adding and deleting them
// this function creates a new book in the json object of the book
export function addBook(dataString: string) {
  const data: Library = JSON.parse(dataString);

  data.books = [
    ...data.books,
    {
      name: "No Longer Human",
      author: "Osamu Dazai"
    }
  ];

  const stringData = JSON.stringify(data);
  return stringData;
}
