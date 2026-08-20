/**
 * @fileoverview Background service worker: builds the context menu and
 * applies the selected transformation to the active page.
 */

import browser from "webextension-polyfill";

import {
    alternatingCase,
    camelCase,
    escapeNewlines,
    kebabCase,
    lowercase,
    pascalCase,
    removeSpecialCharacters,
    sarcasticSpongeBob,
    sentenceCase,
    snakeCase,
    startCase,
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
    sentenceCase,
    startCase,
    titleCaseMla,
    titleCaseAP,
    snakeCase,
    kebabCase,
    pascalCase,
    camelCase,
    sarcasticSpongeBob,
    alternatingCase,
    trimWhitespace,
    removeSpecialCharacters,
};

/**
 * A single context menu entry: either a separator, or a labelled item
 * that triggers a transformation.
 */
type MenuItem =
    | { type: "separator"; id: string }
    | { type?: never; id: string; title: string };

/**
 * Labels and separators for the context menu, organised to match the website's grouping.
 */
const menuItems: MenuItem[] = [
    { id: "escapeNewlines", title: "Escape Newlines" },
    { id: "unescapeNewlines", title: "Unescape Newlines" },
    { id: "separator-case", type: "separator" },
    { id: "uppercase", title: "Uppercase" },
    { id: "lowercase", title: "Lowercase" },
    { id: "sentenceCase", title: "Sentence Case" },
    { id: "startCase", title: "Start Case" },
    { id: "titleCaseMla", title: "MLA Title Case" },
    { id: "titleCaseAP", title: "AP Title Case" },
    { id: "separator-code", type: "separator" },
    { id: "snakeCase", title: "snake_case" },
    { id: "kebabCase", title: "kebab-case" },
    { id: "pascalCase", title: "PascalCase" },
    { id: "camelCase", title: "camelCase" },
    { id: "separator-fun", type: "separator" },
    { id: "sarcasticSpongeBob", title: "Sarcastic SpongeBob" },
    { id: "alternatingCase", title: "Alternating Case" },
    { id: "separator-cleanup", type: "separator" },
    { id: "trimWhitespace", title: "Trim Whitespace" },
    { id: "removeSpecialCharacters", title: "Remove Special Characters" },
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

    menuItems.forEach((item) => {
        if (item.type === "separator") {
            browser.contextMenus.create({
                id: item.id,
                type: "separator",
                parentId: "transformText",
                contexts: ["selection"],
            });
        } else {
            browser.contextMenus.create({
                id: item.id,
                parentId: "transformText",
                title: item.title,
                contexts: ["selection"],
            });
        }
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

    void browser.scripting.executeScript({
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
