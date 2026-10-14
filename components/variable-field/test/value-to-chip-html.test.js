/**
 * Stored values are user data: only the chip markup may be HTML.
 */
import { valueToChipHTML } from "../value-to-chip-html";

const label = (name) => `Label ${name}`;

describe("valueToChipHTML", () => {
	it("turns tokens into chips with their labels", () => {
		const html = valueToChipHTML("{{title}} | {site}", label);
		expect(html).toContain('data-variable="title">Label title<span');
		expect(html).toContain('data-variable="site">Label site<span');
		expect(html).toContain(" | ");
	});

	it("escapes markup in the text around tokens", () => {
		const html = valueToChipHTML('<img src=x onerror="alert(1)"> {{title}}', label);
		expect(html).not.toContain("<img");
		expect(html).toContain("&lt;img src=x onerror=\"alert(1)\"&gt;");
	});

	it("escapes markup in chip labels", () => {
		const html = valueToChipHTML("{{title}}", () => "<b>x</b> & y");
		expect(html).toContain(">&lt;b&gt;x&lt;/b&gt; &amp; y<span");
	});

	it("leaves an editable space at the end and handles empty values", () => {
		expect(valueToChipHTML("plain", label)).toBe("plain​");
		expect(valueToChipHTML("", label)).toBe("");
	});
});
