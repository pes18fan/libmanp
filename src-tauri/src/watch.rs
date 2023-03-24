use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher};
use notify_debouncer_mini::{new_debouncer, DebounceEventResult};
use tauri::Window;

use std::path::Path;
use std::sync::mpsc::channel;
use std::thread;
use std::time::Duration;

use lazy_static::lazy_static;
use std::sync::Mutex;

#[derive(Clone, serde::Serialize)]
struct Placeholder {
    msg: String,
}

// lazy static to prevent a new thread with a new watcher being created every time the watch function runs
lazy_static! {
    static ref WATCHER: Mutex<Option<notify::RecommendedWatcher>> = Mutex::new(None);
}

#[tauri::command]
pub fn watch(window: Window, file_path: String) {
    let mut watcher_lock = WATCHER.lock().unwrap();

    if watcher_lock.is_none() {
        let mut debouncer = new_debouncer(
            Duration::from_millis(200),
            None,
            move |res: DebounceEventResult| match res {
                Ok(events) => {
                    events.iter().for_each(|e| {
                        println!("Event {:?} for {:?}", e.kind, e.path);
                        window
                            .emit(
                                "file-change",
                                Placeholder {
                                    msg: "placeholder".into(),
                                },
                            )
                            .unwrap();
                    });
                }
                Err(errs) => {
                    println!("watch error: {:?}", errs);
                    std::process::exit(1);
                }
            },
        )
        .expect("Error creating file watcher");

        // new thread needs to be spawned to avoid blocking the main one
        thread::spawn(move || loop {
            debouncer
                .watcher()
                .watch(Path::new(&file_path), RecursiveMode::Recursive)
                .expect("Error while watching file");
            thread::sleep(Duration::from_millis(300));
        });

        let (sender, _) = channel();

        *watcher_lock = Some(RecommendedWatcher::new(sender, Config::default()).unwrap());
    } else {
        println!("watcher already running");
    }
}
