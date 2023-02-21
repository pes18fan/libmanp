import { BaseDirectory, exists, readTextFile } from "@tauri-apps/api/fs";

export async function load() {
  return {
    libData: (await exists("lib.json", { dir: BaseDirectory.AppData }))
      ? await readTextFile("lib.json", { dir: BaseDirectory.AppData })
      : "N/A"
  };
}
