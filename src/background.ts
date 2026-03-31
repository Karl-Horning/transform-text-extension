import browser from "webextension-polyfill";

import {
    camelCase,
    escapeNewlines,
    kebabCase,
    lowercase,
    pascalCase,
    sarcasticSpongeBob,
    sentenceCase,
    snakeCase,
    titleCaseAP,
    titleCaseMla,
    trimWhitespace,
    unescapeNewlines,
    uppercase,
} from "./transformations";

/**
 * Maps transformation IDs to their corresponding functions.
 */
const transformations: Record<string, (input: string) => string> = {
    escapeNewlines,
    unescapeNewlines,
    uppercase,
    lowercase,
    snakeCase,
    kebabCase,
    pascalCase,
    camelCase,
    sarcasticSpongeBob,
    titleCaseMla,
    titleCaseAP,
    sentenceCase,
    trimWhitespace,
};

/**
 * Labels displayed in the context menu for each transformation.
 */
const menuItems: { id: string; title: string }[] = [
    { id: "uppercase", title: "Uppercase" },
    { id: "lowercase", title: "Lowercase" },
    { id: "snakeCase", title: "snake_case" },
    { id: "kebabCase", title: "kebab-case" },
    { id: "pascalCase", title: "PascalCase" },
    { id: "camelCase", title: "camelCase" },
    { id: "sarcasticSpongeBob", title: "Sarcastic SpongeBob" },
    { id: "titleCaseMla", title: "MLA Title Case" },
    { id: "titleCaseAP", title: "AP Title Case" },
    { id: "sentenceCase", title: "Sentence Case" },
    { id: "trimWhitespace", title: "Trim Whitespace" },
    { id: "escapeNewlines", title: "Escape Newlines" },
    { id: "unescapeNewlines", title: "Unescape Newlines" },
];

/**
 * Creates the parent and child context menu items on extension install.
 */
browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
        id: "transformText",
        title: "Transform Text",
        contexts: ["selection"],
    });

    menuItems.forEach(({ id, title }) => {
        browser.contextMenus.create({
            id,
            parentId: "transformText",
            title,
            contexts: ["selection"],
        });
    });
});

/**
 * Listens for a context menu item click, applies the transformation,
 * and sends the result to the content script.
 */
browser.contextMenus.onClicked.addListener((info, tab) => {
    const transformFn = transformations[info.menuItemId];

    if (!transformFn || !info.selectionText || !tab?.id) return;

    const transformed = transformFn(info.selectionText);

    browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text: string) => {
            const activeElement = document.activeElement as HTMLElement;

            if (!activeElement) return;

            const isInputOrTextarea =
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA";

            const isContentEditable = activeElement.isContentEditable;

            if (!isInputOrTextarea && !isContentEditable) return;

            if (isInputOrTextarea) {
                const el = activeElement as
                    | HTMLInputElement
                    | HTMLTextAreaElement;
                const start = el.selectionStart ?? 0;
                document.execCommand("insertText", false, text);
                el.setSelectionRange(start, start + text.length);
                return;
            }

            if (isContentEditable) {
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return;
                const range = selection.getRangeAt(0);
                const start = range.startOffset;
                const anchorNode = selection.anchorNode;
                document.execCommand("insertText", false, text);
                if (!anchorNode) return;
                const newRange = document.createRange();
                newRange.setStart(anchorNode, start);
                newRange.setEnd(anchorNode, start + text.length);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        },
        args: [transformed],
    });
});
