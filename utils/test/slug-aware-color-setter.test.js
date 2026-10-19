/**
 * Internal dependencies
 */
import { slugAwareColorSetter } from "../slug-aware-color-setter";

describe("slugAwareColorSetter", () => {
	it("saves the picked slug, not the first preset with the same hex", () => {
		const setAttributes = jest.fn();
		const setter = jest.fn();

		slugAwareColorSetter(setAttributes, "panelBackgroundColor", setter)("#ffffff", "white");

		expect(setAttributes).toHaveBeenCalledWith({
			panelBackgroundColor: "white",
			customPanelBackgroundColor: undefined,
		});
		expect(setter).not.toHaveBeenCalled();
	});

	it.each([
		["a custom color", "#123456", undefined],
		["a reset", undefined, undefined],
		["a reset with a stale slug", undefined, "white"],
	])("leaves %s to the withColors setter", (_label, value, slug) => {
		const setAttributes = jest.fn();
		const setter = jest.fn();

		slugAwareColorSetter(setAttributes, "iconColor", setter)(value, slug);

		expect(setter).toHaveBeenCalledWith(value);
		expect(setAttributes).not.toHaveBeenCalled();
	});
});
