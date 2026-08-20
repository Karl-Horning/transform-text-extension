/**
 * @fileoverview The function injected into the page to apply a
 * transformation to the active element.
 *
 * Kept in its own module, separate from background.ts, because
 * chrome.scripting.executeScript serialises this function and injects it
 * into the page — it can only use built-in browser APIs, never imports or
 * variables from an outer closure. Living in its own file with no other
 * imports makes that constraint hard to violate by accident.
 */

/**
 * Replaces the selected text in the page's active element with the given
 * text, then re-selects the replacement.
 *
 * @param text - The replacement text.
 */
export function replaceSelectedText(text: string): void {
    const activeElement = document.activeElement as HTMLElement;

    if (!activeElement) return;

    const isInputOrTextarea =
        activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";

    const isContentEditable = activeElement.isContentEditable;

    if (!isInputOrTextarea && !isContentEditable) return;

    if (isInputOrTextarea) {
        const el = activeElement as HTMLInputElement | HTMLTextAreaElement;
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
}
