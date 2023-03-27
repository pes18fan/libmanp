use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Library {
    pub books: Vec<Book>,
}

#[derive(Serialize, Deserialize)]
pub struct Book {
    pub title: String,
    pub author: String,
    pub uid: String,
    pub date_added: String, // an ISO 8601 date string
}
