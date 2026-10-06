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
let mockBlockName = "test/block";
let mockSupported;
let mockMeta = {};

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
				return {
					getBlock: () => ({ name: mockBlockName, innerBlocks: mockInnerBlocks }),
					getSettings: () => ({ __experimentalBlockBindingsSupportedAttributes: mockSupported }),
				};
			}
			return {
				getEntityRecord: () => ({ meta: mockMeta }),
				getEditedEntityRecord: () => ({ meta: mockMeta }),
			};
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
function hides(bindings, innerBlocks = [], { meta = {}, metaField } = {}) {
	mockInnerBlocks = innerBlocks;
	mockMeta = meta;

	return useMetaGatedEditorVisibility({
		attributes: { hideWhenMetaEmpty: true, metaField, metadata: { bindings } },
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
		[{ name: [], source: "s" }, true],
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

describe("core/post-meta bindings read like core's PHP source", () => {
	const meta = (key) => ({ content: { source: "core/post-meta", args: { key } } });

	afterEach(() => {
		mockSupported = undefined;
		mockBlockName = "test/block";
	});

	it("reads the post's own meta", () => {
		expect(hides(meta("tagline"), [], { meta: { tagline: "Hello" } })).toBe(false);
		expect(hides(meta("tagline"), [], { meta: { tagline: " " } })).toBe(true);
	});

	it("treats an unsaved number field (REST 0, raw '') as empty", () => {
		expect(hides(meta("rcp_int"), [], { meta: { rcp_int: 0 } })).toBe(true);
	});

	it("gives null for protected keys and keys not shown in REST", () => {
		expect(hides(meta("_secret"), [], { meta: { _secret: "x" } })).toBe(true);
		expect(hides(meta("not_in_rest"), [], { meta: {} })).toBe(true);
	});

	it("skips attributes without binding support, as core does", () => {
		mockBlockName = "core/paragraph";
		mockSupported = { "core/paragraph": ["content"] };

		expect(hides({ placeholder: { source: "test/source", args: { value: "" } } })).toBe(false);
	});

	it("handles a binding without args", () => {
		expect(() => hides({ content: { source: "core/post-meta" } })).not.toThrow();
		expect(hides({ content: { source: "core/post-meta" } })).toBe(true);
		expect(() => hides({ content: { source: "test/source" } })).not.toThrow();
	});
});

describe("legacy metaField gates", () => {
	it("hide on an empty or protected field", () => {
		expect(hides(undefined, [], { metaField: "tagline", meta: { tagline: "" } })).toBe(true);
		expect(hides(undefined, [], { metaField: "_secret", meta: { _secret: "x" } })).toBe(true);
	});

	it("stay visible with a value, or when the field isn't in REST (the editor can't read it)", () => {
		expect(hides(undefined, [], { metaField: "tagline", meta: { tagline: "x" } })).toBe(false);
		expect(hides(undefined, [], { metaField: "not_in_rest", meta: {} })).toBe(false);
	});
});
