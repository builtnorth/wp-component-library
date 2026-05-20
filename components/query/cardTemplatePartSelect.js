import {
	SelectControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	buildCardTemplatePartOptions,
	getDefaultCardSlugForPostType,
} from "./cardTemplatePartUtils";

/**
 * Card template part selector for query/post-feed blocks (polaris-cards area).
 *
 * @param {Object} props Component props.
 * @param {Object} props.attributes Block attributes (postType, templatePartSlug).
 * @param {Function} props.setAttributes Set block attributes.
 * @param {string} [props.postType] Post type override.
 * @param {string} [props.area] Template part area (default polaris-cards).
 * @param {string} [props.defaultSlug] Default slug for deselect / empty state.
 * @param {Function} [props.slugFilter] Optional (slug, postType) => boolean.
 * @param {Function} [props.onSlugChange] Optional side effect when slug changes (e.g. sync inner blocks).
 * @param {boolean} [props.isShownByDefault] ToolsPanelItem default visibility.
 * @returns {import('react').WPElement|null} Element to render.
 */
function CardTemplatePartSelect({
	attributes,
	setAttributes,
	postType: postTypeProp,
	area = "polaris-cards",
	defaultSlug: defaultSlugProp,
	slugFilter,
	onSlugChange,
	isShownByDefault = true,
}) {
	const postType = postTypeProp || attributes?.postType || "post";
	const templatePartSlug = attributes?.templatePartSlug || "";
	const resolvedDefault =
		defaultSlugProp || getDefaultCardSlugForPostType(postType);

	const templateParts = useSelect(
		(select) =>
			select("core").getEntityRecords("postType", "wp_template_part", {
				per_page: 200,
				area,
			}),
		[area],
	);

	const options = useMemo(
		() => buildCardTemplatePartOptions(templateParts, postType, slugFilter),
		[templateParts, postType, slugFilter],
	);

	const effectiveValue = templatePartSlug || resolvedDefault;

	useEffect(() => {
		if (!templatePartSlug && resolvedDefault && options.length > 0) {
			const hasDefault = options.some((o) => o.value === resolvedDefault);
			if (hasDefault) {
				setAttributes({ templatePartSlug: resolvedDefault });
			}
		}
	}, [templatePartSlug, resolvedDefault, options, setAttributes]);

	if (!options.length) {
		return null;
	}

	const handleChange = (value) => {
		setAttributes({ templatePartSlug: value });
		onSlugChange?.(value);
	};

	return (
		<ToolsPanelItem
			hasValue={() => effectiveValue !== resolvedDefault}
			label={__("Card layout", "built_starter")}
			onDeselect={() => {
				setAttributes({ templatePartSlug: resolvedDefault });
				onSlugChange?.(resolvedDefault);
			}}
			isShownByDefault={isShownByDefault}
		>
			<SelectControl
				__nextHasNoMarginBottom={true}
				__next40pxDefaultSize
				label={__("Card layout", "built_starter")}
				help={__(
					"Choose which card template part to use for each post in the loop.",
					"built_starter",
				)}
				value={effectiveValue}
				options={options}
				onChange={handleChange}
			/>
		</ToolsPanelItem>
	);
}

export { CardTemplatePartSelect };
