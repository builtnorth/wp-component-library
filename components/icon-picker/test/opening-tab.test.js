/**
 * The icon picker opens on "All" without a selected icon, and on the
 * selected icon's set (by name or alias) when there is one.
 */
import { ALL_TAB, openingTab } from "../utils";

const groups = [
	{ name: "example", icons: [{ name: "axe", source: "<svg>axe</svg>" }] },
	{
		name: "kitaris",
		aliases: ["kitaris-essential"],
		icons: [{ name: "star", source: "<svg>star</svg>" }],
	},
];

const never = () => false;

describe("openingTab", () => {
	it('opens on "All" when no icon is selected, not on the first set', () => {
		expect(openingTab(groups, undefined, never)).toBe(ALL_TAB);
		expect(ALL_TAB).toBe("");
	});

	it("opens on the selected icon's set", () => {
		expect(openingTab(groups, "kitaris", never)).toBe("kitaris");
	});

	it("opens on the set an older set name is an alias of", () => {
		expect(openingTab(groups, "kitaris-essential", never)).toBe("kitaris");
	});

	it('opens on "All" when the selected icon\'s set is not registered', () => {
		expect(openingTab(groups, "removed-set", never)).toBe(ALL_TAB);
	});

	it("finds the set of a value without one by its icon", () => {
		const isStar = (icon) => icon.name === "star";
		expect(openingTab(groups, undefined, isStar)).toBe("kitaris");
	});

	it('opens on "All" before any set is registered', () => {
		expect(openingTab([], "kitaris", never)).toBe(ALL_TAB);
	});
});
