/**
 * @fileoverview Unit tests for the context menu wiring in background.ts.
 *
 * webextension-polyfill throws when imported outside a real browser
 * extension, so the whole module is replaced with vi.mock — there is no
 * global to stub here, unlike code that calls chrome.* directly.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Menus, Tabs } from "webextension-polyfill";
import { buildContextMenu, handleMenuClick, menuItems } from "../background";

const { mockContextMenusCreate, mockExecuteScript } = vi.hoisted(() => ({
    mockContextMenusCreate: vi.fn(),
    mockExecuteScript: vi.fn(),
}));

vi.mock("webextension-polyfill", () => ({
    default: {
        runtime: {
            onInstalled: { addListener: vi.fn() },
        },
        contextMenus: {
            create: mockContextMenusCreate,
            onClicked: { addListener: vi.fn() },
        },
        scripting: {
            executeScript: mockExecuteScript,
        },
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("buildContextMenu", () => {
    it("creates the parent menu item first", () => {
        buildContextMenu();

        expect(mockContextMenusCreate).toHaveBeenNthCalledWith(1, {
            id: "transformText",
            title: "Transform Text",
            contexts: ["selection"],
        });
    });

    it("creates one child item per entry in menuItems, under the parent", () => {
        buildContextMenu();

        expect(mockContextMenusCreate).toHaveBeenCalledTimes(
            menuItems.length + 1,
        );
    });

    it("creates separators with type: separator and no title", () => {
        buildContextMenu();

        expect(mockContextMenusCreate).toHaveBeenCalledWith({
            id: "separator-case",
            type: "separator",
            parentId: "transformText",
            contexts: ["selection"],
        });
    });

    it("creates labelled items with their title and no type", () => {
        buildContextMenu();

        expect(mockContextMenusCreate).toHaveBeenCalledWith({
            id: "uppercase",
            parentId: "transformText",
            title: "Uppercase",
            contexts: ["selection"],
        });
    });
});

/**
 * Builds a minimal, valid OnClickData fixture, overriding only the fields
 * a given test cares about.
 *
 * @param overrides - Fields to override on the default fixture.
 * @returns A complete OnClickData object.
 */
function clickInfo(overrides: Partial<Menus.OnClickData>): Menus.OnClickData {
    return {
        menuItemId: "uppercase",
        editable: false,
        selectionText: "hello",
        modifiers: [],
        ...overrides,
    };
}

describe("handleMenuClick", () => {
    const tab = { id: 7 } as Tabs.Tab;

    it("does nothing for an unknown menu item ID", () => {
        handleMenuClick(clickInfo({ menuItemId: "not-a-real-id" }), tab);

        expect(mockExecuteScript).not.toHaveBeenCalled();
    });

    it("does nothing when there is no selected text", () => {
        handleMenuClick(clickInfo({ selectionText: "" }), tab);

        expect(mockExecuteScript).not.toHaveBeenCalled();
    });

    it("does nothing when the click has no tab ID", () => {
        handleMenuClick(clickInfo({}), undefined);

        expect(mockExecuteScript).not.toHaveBeenCalled();
    });

    it("injects the transformed text into the clicked tab", () => {
        handleMenuClick(clickInfo({}), tab);

        expect(mockExecuteScript).toHaveBeenCalledTimes(1);
        const call = mockExecuteScript.mock.calls[0][0] as {
            target: { tabId: number };
            args: string[];
        };
        expect(call.target).toEqual({ tabId: 7 });
        expect(call.args).toEqual(["HELLO"]);
    });
});
