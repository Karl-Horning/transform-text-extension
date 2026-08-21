# Transform Text Extension

A browser extension that adds text transformation options to the context menu. Select any text in an editable field, right-click, and apply a transformation instantly.

[Website](https://www.karlhorning.dev/transform-text-extension/) · [Privacy Policy](https://www.karlhorning.dev/transform-text-extension/privacy.html) · [Support me on Ko-fi](https://ko-fi.com/karlhorning)

## Screenshots and demo

![Transform Text Extension context menu showing transformation options](store-assets/screenshot-1280x800.png)

<a href="https://chromewebstore.google.com/detail/transform-text/hniojnoepnkpmimpnbaljkkcmoaklcii"><img src="store-assets/chrome-dark.svg" alt="Available for Google Chrome" width="190"></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/transform-text/jmmaiegdlpmbochdbahokkbjelncaioc"><img src="store-assets/edge-dark.svg" alt="Available for Microsoft Edge" width="190"></a>
<a href="https://addons.mozilla.org/en-GB/firefox/addon/transform-text/"><img src="store-assets/firefox-dark.svg" alt="Available for Mozilla Firefox" width="190"></a>

## Features

### Escaping

- Escape Newlines / Unescape Newlines

### Case

- Uppercase / Lowercase
- Sentence Case, Start Case, MLA Title Case, AP Title Case

### Code format

- snake_case, kebab-case, PascalCase, camelCase

### Fun

- Sarcastic SpongeBob, Alternating Case

### Cleanup

- Trim Whitespace, Remove Special Characters

## Tech stack

- **Language**: TypeScript
- **Build**: esbuild
- **Testing**: Vitest
- **Accessibility testing**: axe-core (docs pages)
- **Tooling**: ESLint

## Notable decisions

- **Only editable fields are supported** — that means `<input>`, `<textarea>`, and any `contenteditable` element. Selected text in non-editable elements such as paragraphs and headings can't be replaced.
- **Selection text is read directly from the page, not from `info.selectionText`** — Chrome replaces every line break in `info.selectionText` with a space before the extension ever sees it, which broke Escape/Unescape Newlines. A small script is injected to read the live selection from the active element instead, which preserves real newlines. Falls back to `info.selectionText` if that read fails. Firefox was never affected, but goes through the same path for consistency.
- **Replacement doesn't always work in complex editors** — apps that manage their own editor state, such as Copilot and Gemini, may not accept the replacement or re-selection.
- **`docs/*.test.ts` needed their own tsconfig** — they sit outside `src`, the only directory the main `tsconfig.json` includes, so ESLint's type-aware rules couldn't parse them until `tsconfig.docs.json` was added and referenced from the ESLint config.

## Local development

```bash
git clone https://github.com/Karl-Horning/transform-text-extension.git
cd transform-text-extension
npm install
npm run build
```

Then load the extension in your browser:

**Chrome / Edge:**

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist/` folder

**Firefox:**

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `dist/manifest.json`

Firefox removes temporary add-ons on restart, so you'll need to reload it each session.

## Scripts

| Command                 | Description                                  |
|-------------------------|----------------------------------------------|
| `npm run build`         | Compile and copy the extension into `dist/`  |
| `npm run package`       | Build and zip store packages into `release/` |
| `npm run lint`          | Lint the source with ESLint                  |
| `npm run test`          | Run all tests once                           |
| `npm run test:watch`    | Run tests in watch mode                      |
| `npm run test:coverage` | Run tests with coverage                      |
| `npm run docs:serve`    | Serve the `docs/` site locally               |

## Feedback and issues

Found a bug or have a suggestion? [Open an issue](https://github.com/Karl-Horning/transform-text-extension/issues).

## Design

Source design files are in `design/` and were created in [Affinity](https://www.affinity.studio/graphic-design-software).

Built with [Claude](https://claude.ai) as an AI coding assistant. Architecture, decisions, testing, and the writing voice throughout are mine.

<a href="https://ko-fi.com/karlhorning"><img src="store-assets/support_me_on_kofi_badge_beige.png" alt="Support me on Ko-fi" width="100"></a>

## License

Released under the [MIT License](./LICENSE) by [Karl Horning](https://github.com/Karl-Horning).
