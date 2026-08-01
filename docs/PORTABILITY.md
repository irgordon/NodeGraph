# NodeGraph Portability

NodeGraph must work from any checkout or installed-extension folder on macOS, Linux, and Windows. It must not depend on a developer name, home folder, package-manager location, shell, drive letter, hostname, local port, or VS Code installation path.

## Runtime rules

- Installed assets are located from VS Code's `extensionUri` and joined with `Uri.joinPath()`.
- Project records store forward-slash paths relative to the project folder.
- `ProjectPathResolver` rejects absolute paths, backslashes, empty path parts, and traversal before it reads the filesystem.
- The path checker resolves real paths and uses `path.relative()` to keep files inside the project. It does not rely on matching the start of a path string.
- Temporary projects and test bundles use `os.tmpdir()`.
- Environment checks discover tools through the process search path and pass arguments without starting a shell.
- Repository tools use Node entry points. The batch HTML exporter uses the caller's current folder unless a folder is supplied.
- The tracked `.agent/ENVIRONMENT.md` is a neutral placeholder. The extension writes a fresh machine report into the active graph workspace at runtime, and that generated copy is not packaged.
- Moving a complete project folder keeps its graph, extraction, evidence, and PDF references valid because saved records do not contain the old location.

Phase 4 adversarial-pass records must follow the same rule. They identify the corpus with the saved corpus revision, taxonomy version, stable paper and evidence IDs, and project-relative document paths. They must not save a local checkout, PDF, home-folder, or temporary path.

## Automated gate

`npm run test:portability` checks:

- POSIX and Windows path construction with their platform-specific path utilities.
- Spaces and Unicode in project and installed-extension folders.
- Project-relative PDF access before and after moving the project folder.
- Schema loading from an explicit installed-extension resource location.
- Shell-free runtime tool discovery.
- Node-based repository tools with no Bash-only wrapper or developer-folder default.
- Portable launch configuration.
- Source, documentation, configuration, resources, demos, fixtures, generated bundles, and persisted examples for machine values.
- Packaged runtime-template hashes and the local VSIX when that ignored artifact is present.

The complete test suite is also run from a temporary checkout path containing spaces and Unicode during the portability audit.

## Reviewed exceptions

- `dist/pdf.worker.min.mjs` contains PDF.js's virtual `HOME` value `/home/web_user`. This value comes from the bundled `pdfjs-dist` worker, describes its browser-compatible virtual environment, and does not read or expose the development machine's home folder.
- GitHub links and JSON Schema `$id` values containing `Jeong-jin-Han/NodeGraph` identify the public upstream project. They are network identifiers, not filesystem paths.
- Invalid contract fixtures may contain deliberately unsafe paths when the fixture exists to prove rejection. Valid, runtime, legacy, and packaged examples must remain location neutral.
