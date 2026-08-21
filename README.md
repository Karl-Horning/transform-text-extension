# Transform Text Extension

A browser extension that adds text transformation options to the context menu. Select any text in an editable field, right-click, and apply a transformation instantly.

[Website](https://karl-horning.github.io/transform-text-extension/) · [Privacy Policy](https://karl-horning.github.io/transform-text-extension/privacy.html) · [Support me on Ko-fi](https://ko-fi.com/karlhorning)

## Screenshots and demo

![Transform Text Extension context menu showing transformation options](store-assets/screenshot-1280x800.png)

[![Available for Google Chrome](store-assets/store-banners-chrome.webp)](https://chromewebstore.google.com/detail/transform-text/hniojnoepnkpmimpnbaljkkcmoaklcii)
[![Available for Microsoft Edge](store-assets/store-banners-edge.webp)](https://microsoftedge.microsoft.com/addons/detail/transform-text/jmmaiegdlpmbochdbahokkbjelncaioc)
[![Available for Mozilla Firefox](store-assets/store-banners-firefox.webp)](https://addons.mozilla.org/en-GB/firefox/addon/transform-text/)
[![Support me on Ko-fi](store-assets/support_me_on_kofi_badge_beige.webp)](https://ko-fi.com/karlhorning)

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
- **Tooling**: ESLint

## Notable decisions

- **Only editable fields are supported** — that means `<input>`, `<textarea>`, and any `contenteditable` element. Selected text in non-editable elements such as paragraphs and headings can't be replaced.
- **Escape Newlines and Unescape Newlines can behave unexpectedly** — a browser limitation strips newlines from `selectionText` before the extension ever sees the selected text.
- **Replacement doesn't always work in complex editors** — apps that manage their own editor state, such as Copilot and Gemini, may not accept the replacement or re-selection.

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

## Feedback and issues

Found a bug or have a suggestion? [Open an issue](https://github.com/Karl-Horning/transform-text-extension/issues).

## Design

Source design files are in `design/` and were created in [Affinity](https://www.affinity.studio/graphic-design-software).

Built with [Claude](https://claude.ai) as an AI coding assistant. Architecture, decisions, testing, and the writing voice throughout are mine.

## License

Released under the [MIT License](./LICENSE) by [Karl Horning](https://github.com/Karl-Horning).
