/// <reference types='@sveltejs/kit' />

interface Book {
  title: string;
  author: string;
}

interface Library {
  books: Array<Book>;
}
