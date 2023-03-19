use std::fs::write;

use crate::structs::{Book, Library};

type EditBookResult<T> = std::result::Result<T, tauri::InvokeError>;

#[tauri::command]
pub fn edit_book(existing_json: &str, file_path: &str, old_book_data: Book, new_book_data: Book) -> EditBookResult<()> {
    let existing_json = existing_json
        .replace("\\", "")
        .replace("\"{", "{")
        .replace("}\"", "}");

    let mut b: Library = serde_json::from_str(&existing_json).expect("Error parsing json");

    let book_being_edited = b.books.iter().position(|b| b.uid == old_book_data.uid).expect("Error finding book to edit");

    b.books[book_being_edited].title = new_book_data.title;
    b.books[book_being_edited].author = new_book_data.author;

    let j = serde_json::to_string(&b).expect("Error converting struct to json");

    println!("successfully wrote {} to {}", j, file_path);

    write(file_path, j).expect("Failed to edit file");

    Ok(())
}