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
 * @param {string} [props.textDomain] i18n text domain.
 * @param {boolean} [props.disableAutoFill] Skip auto-setting default slug on mount.
 * @param {boolean} [props.usePersistedSlugOnly] Select value is the saved slug only (no default fallback writes).
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
	textDomain = "built_starter",
	disableAutoFill = false,
	usePersistedSlugOnly = false,
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

	const selectValue = usePersistedSlugOnly
		? templatePartSlug
		: templatePartSlug || resolvedDefault;

	useEffect(() => {
		if (disableAutoFill) {
			return;
		}

		if (!templatePartSlug && resolvedDefault && options.length > 0) {
			const hasDefault = options.some((o) => o.value === resolvedDefault);
			if (hasDefault) {
				setAttributes({ templatePartSlug: resolvedDefault });
			}
		}
	}, [
		templatePartSlug,
		resolvedDefault,
		options,
		setAttributes,
		disableAutoFill,
	]);

	if (!options.length) {
		return null;
	}

	const handleChange = (value) => {
		if (!value || value === templatePartSlug) {
			return;
		}

		setAttributes({ templatePartSlug: value });

		// Caller may already sync in setAttributes (e.g. core/query); skip duplicate updates.
		if (onSlugChange) {
			onSlugChange(value);
		}
	};

	return (
		<ToolsPanelItem
			hasValue={() =>
				!!templatePartSlug && templatePartSlug !== resolvedDefault
			}
			label={__("Card layout", textDomain)}
			onDeselect={() => {
				setAttributes({ templatePartSlug: resolvedDefault });

				if (onSlugChange) {
					onSlugChange(resolvedDefault);
				}
			}}
			isShownByDefault={isShownByDefault}
		>
			<SelectControl
				__nextHasNoMarginBottom={true}
				__next40pxDefaultSize
				label={__("Card layout", textDomain)}
				help={__(
					"Choose which card template part to use for each post in the loop.",
					textDomain,
				)}
				value={selectValue}
				options={options}
				onChange={handleChange}
			/>
		</ToolsPanelItem>
	);
}

export { CardTemplatePartSelect };
