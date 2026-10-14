/**
 * Order option values split into orderby and order at the last underscore.
 */
// Only the parsing is under test; the controls aren't rendered. Virtual:
// WordPress provides the package at runtime, so a standalone install has none.
jest.mock(
	"@wordpress/components",
	() => ({
		SelectControl: () => null,
		__experimentalToolsPanelItem: () => null,
	}),
	{ virtual: true }
);

import { defaultOrderOptions, parseOrderValue } from "../orderBySelect";

describe("parseOrderValue", () => {
	it("keeps an underscore inside orderby (Custom Order)", () => {
		expect(parseOrderValue("menu_order_asc")).toEqual({ orderPostsBy: "menu_order", orderPostsDirection: "asc" });
	});

	it.each(defaultOrderOptions.map((option) => [option.value]))("round-trips %s", (value) => {
		const { orderPostsBy, orderPostsDirection } = parseOrderValue(value);
		expect(`${orderPostsBy}_${orderPostsDirection}`).toBe(value);
	});
});
