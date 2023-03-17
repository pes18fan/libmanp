#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod add_book;
mod watch;

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

use crate::add_book::add_new_book;
use crate::watch::watch;

// creates the main menu
pub fn create_menu() -> Menu {
  // here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");

  let about = CustomMenuItem::new("about".to_string(), "About");

  let file = Submenu::new("File", Menu::new().add_item(quit));
  let help = Submenu::new("Help", Menu::new().add_item(about));

  Menu::new()
    .add_native_item(MenuItem::Copy)
    .add_submenu(file)
    .add_submenu(help)
}

fn main() {
  tauri::Builder::default()
    .menu(create_menu())
    // event handler for when the various menu buttons are pressed
    .on_menu_event(|event| match event.menu_item_id() {
      "quit" => {
        std::process::exit(0);
      }
      "about" => {
        event.window().emit("about", "").unwrap();
      }
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![add_new_book, watch])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
