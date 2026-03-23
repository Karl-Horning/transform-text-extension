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
    { id: "escapeNewlines", title: "Escape Newlines" },
    { id: "unescapeNewlines", title: "Unescape Newlines" },
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
];

/**
 * Creates the parent and child context menu items on extension install.
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "transformText",
        title: "Transform Text",
        contexts: ["selection"],
    });

    menuItems.forEach(({ id, title }) => {
        chrome.contextMenus.create({
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
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const transformFn = transformations[info.menuItemId];

    if (!transformFn || !info.selectionText || !tab?.id) return;

    const transformed = transformFn(info.selectionText);

    chrome.tabs.sendMessage(tab.id, {
        type: "TRANSFORM_TEXT",
        text: transformed,
    });
});
