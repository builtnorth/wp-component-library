/**
 * The editor's loop preview hides meta-gated blocks by the same rules as
 * navas-utility MetaGatedRender on the front end.
 */
const mockSources = {
	"test/source": {
		getValues: ({ bindings }) =>
			Object.fromEntries(Object.entries(bindings).map(([attribute, binding]) => [attribute, binding.args?.value])),
	},
};
let mockInnerBlocks = [];

jest.mock("@wordpress/blocks", () => ({ getBlockBindingsSource: (name) => mockSources[name] }));
jest.mock("@wordpress/block-editor", () => ({ store: "core/block-editor" }));
jest.mock("@wordpress/core-data", () => ({ store: "core" }));
jest.mock("@wordpress/data", () => ({
	useSelect: (callback) =>
		callback((store) => {
			if (store === "core/editor") {
				return { getCurrentPostType: () => "page", getCurrentPostId: () => 1 };
			}
			if (store === "core/block-editor") {
				return { getBlock: () => ({ innerBlocks: mockInnerBlocks }) };
			}
			return { getEntityRecord: () => ({ meta: {} }) };
		}),
}));

/**
 * Internal dependencies
 */
import { isMetaValueEmpty, useMetaGatedEditorVisibility } from "../meta-gated-editor";

const bound = (value, source = "test/source") => ({ content: { source, args: { value } } });
const gone = { content: { source: "plugin/gone" } };
const paragraph = (bindings) => ({ attributes: { metadata: { bindings } }, innerBlocks: [] });

/**
 * Whether a block previewed in a loop (context post 2, editing post 1) hides.
 */
function hides(bindings, innerBlocks = []) {
	mockInnerBlocks = innerBlocks;

	return useMetaGatedEditorVisibility({
		attributes: { hideWhenMetaEmpty: true, metadata: { bindings } },
		clientId: "client-1",
		context: { postId: 2, postType: "post" },
	}).shouldHide;
}

describe("isMetaValueEmpty", () => {
	it.each([
		[["a", "b"], true],
		[[""], true],
		[{ name: "0", source: "b" }, true],
		[{ name: "wrench", source: "<svg/>" }, false],
		[" ", false],
		[" \n", true],
		["x", false],
		[0, false],
		[null, true],
	])("reads %p as empty: %p, as PHP does", (value, expected) => {
		expect(isMetaValueEmpty(value)).toBe(expected);
	});
});

describe("useMetaGatedEditorVisibility in a loop preview", () => {
	it("gates on the block's own bound values", () => {
		expect(hides(bound(""))).toBe(true);
		expect(hides(bound("x"))).toBe(false);
	});

	it("gates a wrapper on every bound block inside it", () => {
		expect(hides(undefined, [paragraph(bound("")), paragraph(bound("y"))])).toBe(false);
		expect(hides(undefined, [paragraph(bound("")), paragraph(bound(" "))])).toBe(true);
	});

	it("treats bindings to an unregistered source as no binding", () => {
		expect(hides(gone)).toBe(false);
		expect(hides(gone, [paragraph(bound("x"))])).toBe(false);
		expect(hides(gone, [paragraph(bound(""))])).toBe(true);
		expect(hides(undefined, [paragraph(gone)])).toBe(false);
	});
});
