// @vitest-environment jsdom

/**
 * @fileoverview Unit tests for replaceSelectedText, the function injected
 * into the page to apply a transformation to the active element.
 *
 * jsdom doesn't implement document.execCommand at all, so "insertText" is
 * stubbed with a minimal simulation for input/textarea elements — real
 * enough that setSelectionRange's clamping to the new value length
 * matches what a real browser would do. jsdom also doesn't implement
 * Element.isContentEditable, so it's defined manually on the
 * contenteditable test fixtures.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { replaceSelectedText } from "../replaceSelectedText";

let mockExecCommand: ReturnType<typeof vi.fn<Document["execCommand"]>>;

beforeEach(() => {
    document.body.innerHTML = "";
    mockExecCommand = vi.fn<Document["execCommand"]>((command, _ui, value) => {
        if (command !== "insertText" || typeof value !== "string") return false;
        const active = document.activeElement as
            | HTMLInputElement
            | HTMLTextAreaElement
            | null;
        if (active && "setSelectionRange" in active) {
            const start = active.selectionStart ?? active.value.length;
            const end = active.selectionEnd ?? start;
            active.value = active.value.slice(0, start) + value + active.value.slice(end);
            active.setSelectionRange(start + value.length, start + value.length);
        }
        return true;
    });
    document.execCommand = mockExecCommand;
    window.getSelection()?.removeAllRanges();
});

afterEach(() => {
    vi.restoreAllMocks();
});

/**
 * Creates a focused contenteditable div containing the given text.
 *
 * jsdom's focus() looks at the real contenteditable attribute, but doesn't
 * implement the isContentEditable property it's meant to drive — both are
 * needed here to reproduce real browser behaviour.
 *
 * @param text - The div's text content.
 * @returns The created, focused div.
 */
function createFocusedContentEditableDiv(text: string): HTMLDivElement {
    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    Object.defineProperty(div, "isContentEditable", {
        value: true,
        configurable: true,
    });
    div.textContent = text;
    document.body.appendChild(div);
    div.focus();
    return div;
}

describe("replaceSelectedText", () => {
    it("does nothing when the active element isn't editable", () => {
        // Nothing has been focused, so document.activeElement is document.body.
        expect(() => replaceSelectedText("REPLACED")).not.toThrow();
        expect(mockExecCommand).not.toHaveBeenCalled();
    });

    it("does nothing when there is no active element at all", () => {
        vi.spyOn(document, "activeElement", "get").mockReturnValue(null);

        expect(() => replaceSelectedText("REPLACED")).not.toThrow();
        expect(mockExecCommand).not.toHaveBeenCalled();
    });

    it("replaces the selection in an input and re-selects the replacement", () => {
        const input = document.createElement("input");
        input.value = "hello world";
        document.body.appendChild(input);
        input.focus();
        input.setSelectionRange(0, 5);

        replaceSelectedText("HELLO");

        expect(mockExecCommand).toHaveBeenCalledWith(
            "insertText",
            false,
            "HELLO",
        );
        expect(input.selectionStart).toBe(0);
        expect(input.selectionEnd).toBe("HELLO".length);
    });

    it("replaces the selection in a textarea the same way", () => {
        const textarea = document.createElement("textarea");
        textarea.value = "hello world";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.setSelectionRange(6, 11);

        replaceSelectedText("WORLD!!");

        expect(mockExecCommand).toHaveBeenCalledWith(
            "insertText",
            false,
            "WORLD!!",
        );
        expect(textarea.selectionStart).toBe(6);
        expect(textarea.selectionEnd).toBe(6 + "WORLD!!".length);
    });

    it("does nothing in a contenteditable element with no selection range", () => {
        createFocusedContentEditableDiv("hello world");
        // Focusing a contenteditable element places a caret, which jsdom
        // represents as a collapsed range — remove it to reproduce a
        // genuinely empty selection.
        window.getSelection()?.removeAllRanges();

        replaceSelectedText("REPLACED");

        expect(mockExecCommand).not.toHaveBeenCalled();
    });

    it("replaces the selection in a contenteditable element and re-selects the replacement", () => {
        const div = createFocusedContentEditableDiv("hello world");

        const range = document.createRange();
        range.setStart(div.firstChild as Node, 0);
        range.setEnd(div.firstChild as Node, 5);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        replaceSelectedText("HELLO");

        expect(mockExecCommand).toHaveBeenCalledWith(
            "insertText",
            false,
            "HELLO",
        );
        expect(selection?.rangeCount).toBe(1);
        expect(selection?.getRangeAt(0).startOffset).toBe(0);
    });
});
