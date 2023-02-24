use serde::{Serialize, Deserialize};
use serde_json::Result;
use std::fs::write;

#[derive(Serialize, Deserialize)]
struct Library {
    books: Vec<Book>
}

#[derive(Serialize, Deserialize)]
struct Book {
    name: String,
    author: String
}

pub fn add_new_book(existing_json: &str, file_path: &str) -> Result<()> {
    // for some reason, the existing_json var ends up having extra backslashes and quotes and whatnot which mess it up and cause deserialization to fail
    // this line fixes that issue. thanks, ChatGPT!
    let existing_json = existing_json.replace("\\", "").replace("\"{", "{").replace("}\"", "}");
    let mut b: Library = serde_json::from_str(&existing_json).expect("Error parsing json");

    b.books.push( Book {
        name: "No Longer Human".to_string(),
        author: "Osamu Dazai".to_string()
    });

    let j = serde_json::to_string(&b).expect("Error converting struct to json");

    println!("{}", file_path);

    write(file_path, j).expect("Failed to write file");

    Ok(())
}