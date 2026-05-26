import { __experimentalToolsPanel as ToolsPanel } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { CardTemplatePartSelect } from "./cardTemplatePartSelect";
import { getDefaultCardSlugForPostType } from "./cardTemplatePartUtils";

/**
 * Card layout ToolsPanel — matches core/query block extension UI.
 *
 * @param {Object} props Component props.
 * @param {Object} props.attributes Block attributes (postType, templatePartSlug).
 * @param {Function} props.setAttributes Set block attributes.
 * @param {string} [props.postType] Post type override.
 * @param {string} [props.area] Template part area (default polaris-cards).
 * @param {string} [props.defaultSlug] Default slug for reset / deselect.
 * @param {Function} [props.slugFilter] Optional (slug, postType) => boolean.
 * @param {Function} [props.onSlugChange] Optional side effect when slug changes.
 * @param {string} [props.textDomain] i18n text domain.
 * @param {boolean} [props.disableAutoFill] Passed to CardTemplatePartSelect.
 * @param {boolean} [props.usePersistedSlugOnly] Passed to CardTemplatePartSelect.
 * @returns {import('react').WPElement|null} Element to render.
 */
function CardTemplatePartPanel({
	attributes,
	setAttributes,
	postType: postTypeProp,
	area,
	defaultSlug: defaultSlugProp,
	slugFilter,
	onSlugChange,
	textDomain = "built_starter",
	disableAutoFill = false,
	usePersistedSlugOnly = false,
}) {
	const postType = postTypeProp || attributes?.postType || "post";
	const resolvedDefault =
		defaultSlugProp || getDefaultCardSlugForPostType(postType);

	const resetCardLayout = () => {
		setAttributes({ templatePartSlug: resolvedDefault });

		// onSlugChange is optional; query blocks handle inner sync via setAttributes.
		if (onSlugChange) {
			onSlugChange(resolvedDefault);
		}
	};

	return (
		<ToolsPanel
			label={__("Card layout", textDomain)}
			resetAll={resetCardLayout}
		>
			<CardTemplatePartSelect
				attributes={attributes}
				setAttributes={setAttributes}
				postType={postType}
				area={area}
				defaultSlug={resolvedDefault}
				slugFilter={slugFilter}
				onSlugChange={onSlugChange}
				textDomain={textDomain}
				disableAutoFill={disableAutoFill}
				usePersistedSlugOnly={usePersistedSlugOnly}
			/>
		</ToolsPanel>
	);
}

export { CardTemplatePartPanel };
