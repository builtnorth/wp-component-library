/**
 * Icon sources are block data: only plain, self-contained SVG may render.
 */
import { safeSvgSource } from "../utils";

const PATH = '<path d="M0 0h24v24H0z"/>';

describe("safeSvgSource", () => {
	it("keeps a plain icon", () => {
		const html = safeSvgSource(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${PATH}</svg>`
		);
		expect(html).toContain("<svg");
		expect(html).toContain('viewBox="0 0 24 24"');
		expect(html).toContain('d="M0 0h24v24H0z"');
	});

	it("returns an empty string for non-strings and markup without an svg", () => {
		expect(safeSvgSource(null)).toBe("");
		expect(safeSvgSource({ source: "<svg></svg>" })).toBe("");
		expect(safeSvgSource('<img src=x onerror="alert(1)">')).toBe("");
	});

	it("removes script elements", () => {
		const html = safeSvgSource(
			`<svg><script>alert(1)</script>${PATH}</svg>`
		);
		expect(html).not.toMatch(/script/i);
		expect(html).toContain("<path");
	});

	it("removes event handler attributes", () => {
		const html = safeSvgSource(`<svg onload="alert(1)">${PATH}</svg>`);
		expect(html).not.toMatch(/onload/i);
		expect(html).toContain("<svg");
	});

	it("removes style elements", () => {
		const html = safeSvgSource(
			`<svg><style>body{display:none}</style>${PATH}</svg>`
		);
		expect(html).not.toMatch(/<style/i);
		expect(html).not.toContain("display:none");
		expect(html).toContain("<path");
	});

	it("removes image elements", () => {
		const html = safeSvgSource(
			`<svg><image href="https://example.com/px.png"/>${PATH}</svg>`
		);
		expect(html).not.toMatch(/<image/i);
		expect(html).not.toContain("example.com");
	});

	it("removes external and javascript hrefs but keeps # references", () => {
		const html = safeSvgSource(
			'<svg xmlns:xlink="http://www.w3.org/1999/xlink">' +
				'<a href="#p">' +
				PATH +
				'</a><a xlink:href="https://example.com/x">' +
				PATH +
				'</a><a href="https://example.com/y">' +
				PATH +
				'</a><a href="javascript:alert(1)">' +
				PATH +
				"</a></svg>"
		);
		expect(html).toContain('href="#p"');
		expect(html).not.toContain("example.com");
		expect(html).not.toMatch(/javascript:/i);
	});

	it("removes style attributes that load resources", () => {
		const html = safeSvgSource(
			'<svg><path style="fill:url(https://example.com/x)" d="M0 0"/>' +
				'<path style="fill:u\\72l(https://example.com/y)" d="M1 1"/></svg>'
		);
		expect(html).not.toContain("example.com");
		expect(html).not.toMatch(/style=/i);
	});

	it("keeps harmless style attributes", () => {
		const html = safeSvgSource(
			'<svg><path style="fill:#ff0000;stroke-width:2" d="M0 0"/></svg>'
		);
		expect(html).toContain("fill:#ff0000");
	});

	it("strips a leading comment before the svg", () => {
		const html = safeSvgSource(
			`<!-- @license lucide v1 --><svg viewBox="0 0 24 24">${PATH}</svg>`
		);
		expect(html.startsWith("<svg")).toBe(true);
		expect(html).not.toContain("license");
	});

	it("extracts the svg after junk and drops the junk", () => {
		const html = safeSvgSource(
			`<img src=x onerror="alert(1)"><p>hi</p><svg viewBox="0 0 24 24">${PATH}</svg>`
		);
		expect(html.startsWith("<svg")).toBe(true);
		expect(html).not.toMatch(/onerror|<img|<p>/i);
		expect(html).toContain("<path");
	});
});
