/**
 * Represents the message sent from the service worker
 * when a transformation has been applied.
 */
interface TransformMessage {
    type: "TRANSFORM_TEXT";
    text: string;
}

/**
 * Type guard to verify an unknown message is a TransformMessage.
 *
 * @param message - The message to check.
 * @returns True if the message is a valid TransformMessage.
 */
const isTransformMessage = (message: unknown): message is TransformMessage =>
    typeof message === "object" &&
    message !== null &&
    (message as TransformMessage).type === "TRANSFORM_TEXT" &&
    typeof (message as TransformMessage).text === "string";

/**
 * Replaces the currently selected text in an editable field
 * with the transformed text.
 *
 * Uses `document.execCommand('insertText')` as it is the only
 * reliable cross-browser method for replacing selected text in
 * editable fields. It is technically deprecated but has no
 * modern replacement for this use case.
 *
 * @param text - The transformed text to insert.
 */
const replaceSelectedText = (text: string): void => {
    const activeElement = document.activeElement as HTMLElement;

    if (!activeElement) return;

    const isInputOrTextarea =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA";

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
};

/**
 * Listens for transformation messages from the service worker
 * and replaces the selected text in the active editable element.
 */
chrome.runtime.onMessage.addListener((message: unknown) => {
    if (!isTransformMessage(message)) return;
    replaceSelectedText(message.text);
});
