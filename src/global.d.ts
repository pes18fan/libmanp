/// <reference types='@sveltejs/kit' />

type Book = {
  name: string;
  author: string;
};

type Library = {
  books: Array<Book>;
};
