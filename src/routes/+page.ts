import { BaseDirectory, exists } from "@tauri-apps/api/fs";

export async function load() {
    return {
        libFileExistence: await exists("lib.json", {dir: BaseDirectory.AppData})
    };
}