/**
 * @fileoverview Background service worker: builds the context menu and
 * applies the selected transformation to the active page.
 */

import browser from "webextension-polyfill";
import type { Menus, Tabs } from "webextension-polyfill";

import { getSelectedText } from "./getSelectedText";
import { replaceSelectedText } from "./replaceSelectedText";
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
export const transformations: Record<string, (input: string) => string> = {
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
export type MenuItem =
    | { type: "separator"; id: string }
    | { type?: never; id: string; title: string };

/**
 * Labels and separators for the context menu.
 */
export const menuItems: MenuItem[] = [
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
    { id: "separator-escaping", type: "separator" },
    { id: "escapeNewlines", title: "Escape Newlines" },
    { id: "unescapeNewlines", title: "Unescape Newlines" },
];

/**
 * Creates the parent and child context menu items.
 */
export function buildContextMenu(): void {
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
}

/**
 * Handles a context menu click: looks up the matching transformation,
 * applies it to the selected text, and injects the replacement into the
 * page the click happened in.
 *
 * @param info - Details about the clicked menu item and current selection.
 * @param tab - The tab the click happened in.
 */
export async function handleMenuClick(
    info: Menus.OnClickData,
    tab: Tabs.Tab | undefined,
): Promise<void> {
    const transformFn = transformations[info.menuItemId];

    if (!transformFn || !info.selectionText || !tab?.id) return;

    const [selectionResult] = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: getSelectedText,
    });

    const liveSelection = selectionResult?.result;
    const sourceText =
        typeof liveSelection === "string" && liveSelection.length > 0
            ? liveSelection
            : info.selectionText;

    const transformed = transformFn(sourceText);

    void browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: replaceSelectedText,
        args: [transformed],
    });
}

browser.runtime.onInstalled.addListener(buildContextMenu);
browser.contextMenus.onClicked.addListener((info, tab) => {
    void handleMenuClick(info, tab);
});
