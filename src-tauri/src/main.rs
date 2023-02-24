#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod add_new_book;

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, Manager, api::path::{resolve_path, BaseDirectory}};

use crate::add_new_book::add_new_book;

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
    .setup(|app| {
      let path = resolve_path(&app.config()
        , app.package_info(), &app.env(), "lib.json", Some(BaseDirectory::AppData)).expect("Failed to resolve");

      let _id = app.listen_global("new-book", move |event| {
        println!("got new-book with payload {}", event.payload().unwrap());

        add_new_book(event.payload().unwrap(), path.to_str().unwrap()).expect("Error adding new book");
      });

      Ok(())
    })
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
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
