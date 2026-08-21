/**
 * @fileoverview The function injected into the page to read the current
 * selection directly from the active element.
 *
 * Kept in its own module, separate from background.ts, because
 * chrome.scripting.executeScript serialises this function and injects it
 * into the page — it can only use built-in browser APIs, never imports or
 * variables from an outer closure. Living in its own file with no other
 * imports makes that constraint hard to violate by accident.
 */

/**
 * Reads the current text selection from the page's active element.
 *
 * @returns The selected text, or an empty string if nothing is selected.
 */
export function getSelectedText(): string {
    const activeElement = document.activeElement as HTMLElement;

    if (!activeElement) return "";

    const isInputOrTextarea =
        activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";

    if (isInputOrTextarea) {
        const el = activeElement as HTMLInputElement | HTMLTextAreaElement;
        return el.value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0);
    }

    if (activeElement.isContentEditable) {
        const selection = window.getSelection();
        return selection ? selection.toString() : "";
    }

    return "";
}
