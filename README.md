# libmanp

Desktop app for managing libraries (of books, not software libraries). Successor to [libman](https://www.github.com/pes18fan/libman), which was a tiny C program for the same purpose.

Currently still under development. First release will come out after currently open issues are closed.

# Development

libmanp is built with Tauri. Follow [these instructions](https://tauri.app/v1/guides/getting-started/prerequisites/) to install the prerequisites for Tauri on your system, which includes Rust. You also need [Nodejs](https://nodejs.dev) and [yarn](https://yarnpkg.com).

Install the Tauri CLI:

```bash
cargo install tauri-cli
```

After installing everything, use these commands to set up a dev environment:

```bash
git clone https://www.github.com/pes18fan/libmanp.git
cd libmanp
yarn
cargo tauri dev
```

# Contributors

- [pes18fan](https://www.github.com/pes18fan) - creator and maintainer