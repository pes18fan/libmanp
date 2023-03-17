/// <reference types='@sveltejs/kit' />

type Book = {
  title: string;
  author: string;
};

type Library = {
  books: Array<Book>;
};
