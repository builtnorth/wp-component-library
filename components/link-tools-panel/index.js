/**
 * Link Tools Panel
 *
 * Link settings for a block: a URL (WordPress's link search), "Use post
 * permalink", "Open in new tab" and, when the block asks for it, the link's
 * rel (e.g. nofollow).
 *
 * - `LinkToolsPanelItems`: the controls as tools panel items, for a block
 *   that already has a ToolsPanel to put them in.
 * - `LinkToolsPanel`: the same items in their own "Link" panel.
 */
import { __experimentalLinkControl as LinkControl } from "@wordpress/block-editor";
import {
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { LinkField } from "./styles";

export const LINK_DEFAULTS = {
	link: "",
	opensInNewTab: false,
	isPermalink: false,
	rel: "",
};

/**
 * Link controls as tools panel items.
 *
 * @param {Object}   props
 * @param {string}   props.link                    Link URL.
 * @param {boolean}  props.opensInNewTab           Whether the link opens in a new tab.
 * @param {boolean}  props.isPermalink             Whether the current post's permalink is used.
 * @param {Function} props.onChange                Called with the changed values, e.g. `{ link }`.
 * @param {string}   [props.panelId]               The surrounding ToolsPanel's `panelId`, if it has one. Items only register with a panel whose id matches.
 * @param {boolean}  [props.isShownByDefault=true] Whether URL and "Open in new tab" show before they have a value; when false they are added from the panel menu.
 * @param {boolean}  [props.showPermalink=true]    Whether to offer "Use post permalink", for blocks that have no such setting.
 * @param {string}   [props.permalinkHelp]         Help text for "Use post permalink".
 * @param {string}   [props.newTabHelp]            Help text shown while "Open in new tab" is on.
 * @param {boolean}  [props.showRel=false]         Whether to offer the link's rel, for blocks that save and render it.
 * @param {string}   [props.rel]                   Link rel, e.g. "nofollow sponsored".
 */
export function LinkToolsPanelItems({
	link = LINK_DEFAULTS.link,
	opensInNewTab = LINK_DEFAULTS.opensInNewTab,
	isPermalink = LINK_DEFAULTS.isPermalink,
	onChange,
	panelId,
	isShownByDefault = true,
	showPermalink = true,
	permalinkHelp = __(
		"Automatically use the current post's permalink as the link.",
		"wp-component-library",
	),
	newTabHelp,
	showRel = false,
	rel = LINK_DEFAULTS.rel,
}) {
	return (
		<>
			{showPermalink && (
				<ToolsPanelItem
					panelId={panelId}
					hasValue={() =>
						isPermalink !== LINK_DEFAULTS.isPermalink
					}
					label={__("Use post permalink", "wp-component-library")}
					onDeselect={() =>
						onChange({ isPermalink: LINK_DEFAULTS.isPermalink })
					}
					isShownByDefault={false}
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__(
							"Use post permalink",
							"wp-component-library",
						)}
						checked={isPermalink}
						onChange={(value) => onChange({ isPermalink: value })}
						help={permalinkHelp}
					/>
				</ToolsPanelItem>
			)}

			{!isPermalink && (
				<ToolsPanelItem
					panelId={panelId}
					hasValue={() => link !== LINK_DEFAULTS.link}
					label={__("URL", "wp-component-library")}
					onDeselect={() => onChange({ link: LINK_DEFAULTS.link })}
					isShownByDefault={isShownByDefault}
				>
					<LinkField>
						<LinkControl
							searchInputPlaceholder={__(
								"Search content or type URL",
								"wp-component-library",
							)}
							value={{ url: link }}
							onChange={({ url }) => onChange({ link: url })}
							onRemove={() =>
								onChange({ link: LINK_DEFAULTS.link })
							}
							showInitialSuggestions={true}
							settings={[]}
						/>
					</LinkField>
				</ToolsPanelItem>
			)}

			<ToolsPanelItem
				panelId={panelId}
				hasValue={() =>
					opensInNewTab !== LINK_DEFAULTS.opensInNewTab
				}
				label={__("Open in new tab", "wp-component-library")}
				onDeselect={() =>
					onChange({ opensInNewTab: LINK_DEFAULTS.opensInNewTab })
				}
				isShownByDefault={isShownByDefault}
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={__("Open in new tab", "wp-component-library")}
					checked={opensInNewTab}
					onChange={(value) => onChange({ opensInNewTab: value })}
					help={opensInNewTab ? newTabHelp : undefined}
				/>
			</ToolsPanelItem>

			{showRel && (
				<ToolsPanelItem
					panelId={panelId}
					hasValue={() => !!rel}
					label={__("Link rel", "wp-component-library")}
					onDeselect={() => onChange({ rel: LINK_DEFAULTS.rel })}
					isShownByDefault={false}
				>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__("Link rel", "wp-component-library")}
						help={__(
							"Space-separated values, e.g. nofollow or sponsored.",
							"wp-component-library",
						)}
						value={rel}
						onChange={(value) => onChange({ rel: value })}
					/>
				</ToolsPanelItem>
			)}
		</>
	);
}

/**
 * Link controls in their own tools panel.
 *
 * Takes the same props as `LinkToolsPanelItems`, plus:
 *
 * @param {Object}   props
 * @param {string}   [props.label]     Panel title. Default "Link".
 * @param {string}   [props.panelId]   Unique id for the panel.
 * @param {string}   [props.className] Extra class for the panel.
 * @param {Function} props.onChange    Called with the changed values.
 */
export function LinkToolsPanel({
	label = __("Link", "wp-component-library"),
	panelId = "link-tools-panel",
	className,
	onChange,
	...itemProps
}) {
	return (
		<ToolsPanel
			label={label}
			panelId={panelId}
			resetAll={() => {
				// rel only for blocks that offer it (they have the attribute).
				const { rel, ...defaults } = LINK_DEFAULTS;
				onChange(itemProps.showRel ? { ...defaults, rel } : defaults);
			}}
			className={className}
		>
			<LinkToolsPanelItems
				{...itemProps}
				onChange={onChange}
				panelId={panelId}
			/>
		</ToolsPanel>
	);
}

export default LinkToolsPanel;
