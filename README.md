# Transform Text Extension

A browser extension that adds text transformation options to the context menu. Select any text in an editable field, right-click, and apply a transformation instantly.

![Transform Text Extension context menu showing transformation options](store/screenshot-1280x800.png)

[![Available for Google Chrome](store/store-banners-chrome.webp)](https://chromewebstore.google.com/detail/transform-text/hniojnoepnkpmimpnbaljkkcmoaklcii)
[![Available for Microsoft Edge](store/store-banners-edge.webp)](https://microsoftedge.microsoft.com/addons/detail/transform-text/jmmaiegdlpmbochdbahokkbjelncaioc)
[![Available for Mozilla Firefox](store/store-banners-firefox.webp)](https://addons.mozilla.org/en-GB/firefox/addon/transform-text/)
[![Support me on Ko-fi](store/support_me_on_kofi_badge_beige.webp)](https://ko-fi.com/karlhorning)

## Tech Stack

- **Language**: TypeScript
- **Build**: esbuild
- **Testing**: Vitest
- **Tooling**: ESLint

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
3. Select `manifest.firefox.json` inside the project folder

## Scripts

| Command                      | Description                               |
| ---------------------------- | ----------------------------------------- |
| `npm run build`              | Compile TypeScript to `dist/`             |
| `npm run build:zip`          | Build and package for Chrome / Edge       |
| `npm run build:zip:firefox`  | Build and package for Firefox             |
| `npm run build:zip:all`      | Build and package for all browsers        |
| `npm run build:source-zip`   | Package source code for store submission  |
| `npm run lint`               | Lint the source with ESLint               |
| `npm run test`               | Run all tests once                        |
| `npm run test:watch`         | Run tests in watch mode                   |
| `npm run test:coverage`      | Run tests with coverage                   |

## Transformations

### Escaping

- Escape Newlines / Unescape Newlines

### Case

- Uppercase / Lowercase
- Sentence Case, Start Case, MLA Title Case, AP Title Case

### Code Format

- snake_case, kebab-case, PascalCase, camelCase

### Fun

- Sarcastic SpongeBob, Alternating Case

### Cleanup

- Trim Whitespace, Remove Special Characters

## Limitations

- Transformations only work in editable fields such as `<input>` and `<textarea>` elements — selected text in non-editable elements such as paragraphs and headings cannot be replaced
- Escape Newlines and Unescape Newlines may not work as expected in all contexts due to a browser limitation where `selectionText` strips newlines from selected text
- Text replacement and re-selection may not work in some complex web applications that manage their own editor state, such as Copilot and Gemini

## Feedback and Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/Karl-Horning/transform-text-extension/issues).

## Design

Source icon files are in `design/icons/` and were created in [Affinity Designer](https://affinity.serif.com/en-gb/designer/).

Built with [Claude](https://claude.ai) as an AI pair programmer.

## License

Released under the [MIT License](./LICENSE) by [Karl Horning](https://github.com/Karl-Horning).
