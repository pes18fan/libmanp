use std::fs::write;

use crate::structs::{Book, Library};

type AnnihilateBookResult<T> = std::result::Result<T, tauri::InvokeError>;

#[tauri::command]
pub fn annihilate_book(existing_json: &str, file_path: &str, book_data: Book) -> AnnihilateBookResult<()> {
    let existing_json = existing_json
        .replace("\\", "")
        .replace("\"{", "{")
        .replace("}\"", "}");

    let mut b: Library = serde_json::from_str(&existing_json).expect("Error parsing json");

    let book_being_deleted = b.books.iter().position(|b| b.uid == book_data.uid).expect("Error finding book to delete");

    let book_being_deleted = b.books.remove(book_being_deleted);

    let j: String = serde_json::to_string(&b).expect("Error converting struct to json");

    println!("successfully removed {} from {} written at {}", book_being_deleted.title, j, file_path);

    write(file_path, j).expect("Failed to edit file");
    
    Ok(())
}