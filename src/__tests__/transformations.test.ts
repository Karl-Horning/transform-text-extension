/**
 * @fileoverview Unit tests for the text transformation functions.
 */

import { describe, expect, it } from "vitest";
import {
    alternatingCase,
    camelCase,
    capitalise,
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
} from "../transformations";

describe("Text Transformation Utilities", () => {
    describe("escapeNewlines", () => {
        it("replaces newlines with \\n", () => {
            expect(escapeNewlines("Hello\nWorld\n")).toBe("Hello\\nWorld");
            expect(escapeNewlines("Line 1\r\nLine 2")).toBe("Line 1\\nLine 2");
        });
    });

    describe("unescapeNewlines", () => {
        it("replaces \\n with actual newlines", () => {
            expect(unescapeNewlines("Hello\\nWorld")).toBe("Hello\nWorld");
        });
    });

    describe("uppercase", () => {
        it("converts to uppercase", () => {
            expect(uppercase("hello")).toBe("HELLO");
        });
    });

    describe("lowercase", () => {
        it("converts to lowercase", () => {
            expect(lowercase("HELLO")).toBe("hello");
        });
    });

    describe("snakeCase", () => {
        it("converts to snake_case", () => {
            expect(snakeCase("Hello World")).toBe("hello_world");
        });
    });

    describe("kebabCase", () => {
        it("converts to kebab-case", () => {
            expect(kebabCase("Hello World")).toBe("hello-world");
        });
    });

    describe("pascalCase", () => {
        it("converts to PascalCase", () => {
            expect(pascalCase("hello world")).toBe("HelloWorld");
        });
    });

    describe("camelCase", () => {
        it("converts to camelCase", () => {
            expect(camelCase("Hello World")).toBe("helloWorld");
        });

        it("handles acronyms correctly", () => {
            expect(camelCase("API response")).toBe("apiResponse");
            expect(camelCase("HTML parser")).toBe("htmlParser");
        });
    });

    describe("sarcasticSpongeBob", () => {
        it("returns same chars with mixed case", () => {
            const input = "hello world";
            const output = sarcasticSpongeBob(input);
            expect(output.length).toBe(input.length);
            expect(output.toLowerCase()).toBe(input.toLowerCase());
            expect(output).toMatch(/[A-Z]/);
            expect(output).toMatch(/[a-z]/);
        });
    });

    describe("titleCaseMla", () => {
        it("formats MLA style titles", () => {
            expect(
                titleCaseMla("the quick brown fox jumps over the lazy dog"),
            ).toBe("The Quick Brown Fox Jumps over the Lazy Dog");
        });
    });

    describe("titleCaseAP", () => {
        it("formats AP style titles", () => {
            expect(
                titleCaseAP("the quick brown fox jumps over the lazy dog"),
            ).toBe("The Quick Brown Fox Jumps Over the Lazy Dog");
        });
    });

    describe("sentenceCase", () => {
        it("formats correctly", () => {
            expect(sentenceCase("HELLO WORLD")).toBe("Hello world");
        });
    });

    describe("capitalise", () => {
        it("uppercases first letter and lowercases the rest", () => {
            expect(capitalise("hello")).toBe("Hello");
            expect(capitalise("HELLO")).toBe("Hello");
            expect(capitalise("hELLO")).toBe("Hello");
        });
    });

    describe("trimWhitespace", () => {
        it("removes leading, trailing, and excess internal spaces", () => {
            expect(trimWhitespace("  hello  ")).toBe("hello");
            expect(trimWhitespace("hello   world")).toBe("hello world");
            expect(trimWhitespace("  hello   world  ")).toBe("hello world");
            expect(trimWhitespace("")).toBe("");
        });
    });

    describe("startCase", () => {
        it("capitalises the first letter of every word", () => {
            expect(startCase("hello world")).toBe("Hello World");
        });

        it("lowercases the remaining letters of each word", () => {
            expect(startCase("HELLO WORLD")).toBe("Hello World");
        });

        it("capitalises short words that MLA and AP would lowercase", () => {
            expect(
                startCase("the quick brown fox jumps over the lazy dog"),
            ).toBe("The Quick Brown Fox Jumps Over The Lazy Dog");
        });

        it("returns an empty string for empty input", () => {
            expect(startCase("")).toBe("");
        });
    });

    describe("alternatingCase", () => {
        it("alternates case starting with uppercase, skipping non-letters", () => {
            expect(alternatingCase("hello world")).toBe("HeLlO wOrLd");
        });

        it("does not count spaces or numbers in the alternation index", () => {
            expect(alternatingCase("hello 123 world")).toBe("HeLlO 123 wOrLd");
        });

        it("returns an empty string for empty input", () => {
            expect(alternatingCase("")).toBe("");
        });
    });

    describe("removeSpecialCharacters", () => {
        it("replaces hyphens and underscores with spaces", () => {
            expect(removeSpecialCharacters("this-is-kebab-case")).toBe(
                "this is kebab case",
            );
            expect(removeSpecialCharacters("hello_world")).toBe("hello world");
        });

        it("removes punctuation and collapses resulting spaces", () => {
            expect(removeSpecialCharacters("hello, world!")).toBe(
                "hello world",
            );
        });

        it("preserves numbers", () => {
            expect(removeSpecialCharacters("hello 123 world")).toBe(
                "hello 123 world",
            );
        });

        it("converts accented characters to their ASCII equivalents", () => {
            expect(removeSpecialCharacters("naïve café")).toBe("naive cafe");
        });

        it("returns an empty string for empty input", () => {
            expect(removeSpecialCharacters("")).toBe("");
        });
    });

    describe("Edge cases", () => {
        it("all functions handle empty strings", () => {
            expect(escapeNewlines("")).toBe("");
            expect(unescapeNewlines("")).toBe("");
            expect(uppercase("")).toBe("");
            expect(lowercase("")).toBe("");
            expect(snakeCase("")).toBe("");
            expect(kebabCase("")).toBe("");
            expect(pascalCase("")).toBe("");
            expect(camelCase("")).toBe("");
            expect(titleCaseMla("")).toBe("");
            expect(titleCaseAP("")).toBe("");
            expect(sentenceCase("")).toBe("");
            expect(startCase("")).toBe("");
            expect(alternatingCase("")).toBe("");
            expect(removeSpecialCharacters("")).toBe("");
        });

        it("all functions handle whitespace-only strings", () => {
            expect(uppercase("   ")).toBe("");
            expect(lowercase("   ")).toBe("");
            expect(snakeCase("   ")).toBe("");
            expect(kebabCase("   ")).toBe("");
            expect(sentenceCase("   ")).toBe("");
        });

        it("all functions handle strings with numbers", () => {
            expect(snakeCase("hello 123 world")).toBe("hello_123_world");
            expect(kebabCase("hello 123 world")).toBe("hello-123-world");
            expect(pascalCase("hello 123 world")).toBe("Hello123World");
            expect(camelCase("hello 123 world")).toBe("hello123World");
        });
    });
});
