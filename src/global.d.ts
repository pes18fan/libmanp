/// <reference types='@sveltejs/kit' />

interface Book {
  title: string;
  author: string;
  readonly uid: string;
  readonly date_added: string;
}

interface Library {
  books: Array<Book>;
}
