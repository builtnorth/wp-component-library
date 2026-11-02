import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const modeLabels = () => ({
    auto: __("Auto", "wp-component-library"),
    manual: __("Manual", "wp-component-library"),
    related: __("Related", "wp-component-library"),
});

/**
 * Standalone selection mode control (auto vs manual, optionally related)
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: true)
 * @param {string[]} props.modes Modes offered, from "auto", "manual", "related" (default: auto and manual)
 * @returns {WPElement} Element to render
 */
function SelectionModeControl({
    attributes: { selectionMode = "auto" },
    setAttributes,
    isShownByDefault = true,
    modes = ["auto", "manual"],
}) {
    const defaultSelectionMode = "auto";
    const labels = modeLabels();

    const handleSelectionModeChange = (value) => {
        setAttributes({
            selectionMode: value,
            // Preserve existing selections when switching modes
        });
    };

    return (
        <ToolsPanelItem
            hasValue={() => selectionMode !== defaultSelectionMode}
            label={__("Selection Mode", "wp-component-library")}
            onDeselect={() =>
                setAttributes({ selectionMode: defaultSelectionMode })
            }
            isShownByDefault={isShownByDefault}
        >
            <ToggleGroupControl
                __next40pxDefaultSize={true}
                __nextHasNoMarginBottom
                label={__("Selection Mode", "wp-component-library")}
                value={selectionMode}
                onChange={handleSelectionModeChange}
                isBlock
            >
                {modes
                    .filter((mode) => labels[mode])
                    .map((mode) => (
                        <ToggleGroupControlOption
                            key={mode}
                            label={labels[mode]}
                            value={mode}
                        />
                    ))}
            </ToggleGroupControl>
        </ToolsPanelItem>
    );
}

export { SelectionModeControl };
