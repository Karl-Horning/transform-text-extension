# Transform Text Extension

A browser extension that adds text transformation options to the context menu. Select any text in an editable field, right-click, and apply a transformation instantly.

![Transform Text Extension context menu showing transformation options](store/screenshot-1280x800.png)

[![Available for Google Chrome](store/store-banners-chrome.webp)](https://chromewebstore.google.com/detail/transform-text/hniojnoepnkpmimpnbaljkkcmoaklcii)
[![Available for Microsoft Edge](store/store-banners-edge.webp)](https://microsoftedge.microsoft.com/addons/detail/transform-text/jmmaiegdlpmbochdbahokkbjelncaioc)
[![Available for Mozilla Firefox](store/store-banners-firefox.webp)](https://addons.mozilla.org/en-GB/firefox/addon/transform-text/)
[![Support me on Ko-fi](store/support_me_on_kofi_badge_beige.webp)](https://ko-fi.com/karlhorning)

- **Author**: [Karl Horning](https://github.com/Karl-Horning)
- **Licence**: MIT

## Tech Stack

- **Language**: TypeScript
- **Build**: esbuild
- **Testing**: Vitest
- **Tooling**: ESLint, Prettier

## Installation

### From source

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
3. Click **Load unpacked** and select the project folder

**Firefox:**

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select the `manifest.json` file inside the project folder

## Scripts

| Command                 | Description                            |
| ----------------------- | -------------------------------------- |
| `npm run build`         | Compile TypeScript to `dist/`          |
| `npm run build:zip`     | Build and package for store submission |
| `npm run test`          | Run all tests once                     |
| `npm run test:watch`    | Run tests in watch mode                |
| `npm run test:coverage` | Run tests with coverage                |

## Transformations

- Escape / Unescape Newlines
- Uppercase / Lowercase
- snake_case, kebab-case, PascalCase, camelCase
- Sentence case, MLA Title Case, AP Title Case
- Sarcastic SpongeBob
- Trim Whitespace

## Limitations

- Transformations only work in editable fields such as `<input>` and `<textarea>` elements — selected text in non-editable elements such as paragraphs and headings cannot be replaced
- Escape Newlines and Unescape Newlines may not work as expected in all contexts due to a browser limitation where `selectionText` strips newlines from selected text
- Text replacement and re-selection may not work in some complex web applications that manage their own editor state, such as Copilot and Gemini

## Feedback and Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/Karl-Horning/transform-text-extension/issues).

## Design

Source icon files are in `design/icons/` and were created in [Affinity Designer](https://affinity.serif.com/en-gb/designer/).

Built with [Claude](https://claude.ai) as an AI pair programmer.
