/// <reference types='@sveltejs/kit' />

interface Book {
  title: string;
  author: string;
  readonly uid: string;
}

interface Library {
  books: Array<Book>;
}
