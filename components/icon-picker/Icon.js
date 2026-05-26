/**
 * Icon Component
 *
 * Renders an SVG icon. Uses the stored `source` string directly (preferred,
 * ensures frontend-saved icons always render even if the set is later removed),
 * with a registry fallback for display-only usage.
 */

import { forwardRef } from "@wordpress/element";
import { useIcon } from "./hooks";
import { safeSvgSource } from "./utils";

const IconDisplay = forwardRef(function IconDisplay(
	{ name, iconSet, source, onClick, className = "", style, ...rest },
	ref,
) {
	// Prefer the directly-passed source (from saved attributes) for reliability.
	// Fall back to registry lookup for display-only usage (e.g. rendering by name).
	const registryIcon = useIcon(iconSet, name);
	const svgSource = safeSvgSource(source || registryIcon?.source || "");

	if (!svgSource) {
		return null;
	}

	const clickProps = {};
	if (typeof onClick === "function") {
		clickProps.role = "button";
		clickProps.tabIndex = 0;
		clickProps["aria-label"] = "Change Icon";
		clickProps.onClick = onClick;
		clickProps.onKeyDown = (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick(e);
			}
		};
	}

	return (
		<div
			ref={ref}
			className={`wpcl-icon${className ? ` ${className}` : ""}`}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: svgSource }}
			style={style}
			{...clickProps}
			{...rest}
		/>
	);
});

export { IconDisplay as Icon };
