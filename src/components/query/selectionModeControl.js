import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Standalone selection mode control (auto vs manual)
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: true)
 * @returns {WPElement} Element to render
 */
function SelectionModeControl({
    attributes: { selectionMode = "auto" },
    setAttributes,
    isShownByDefault = true,
}) {
    const defaultSelectionMode = "auto";

    const handleSelectionModeChange = (value) => {
        setAttributes({
            selectionMode: value,
            // Preserve existing selections when switching modes
        });
    };

    return (
        <ToolsPanelItem
            hasValue={() => selectionMode !== defaultSelectionMode}
            label={__("Selection Mode", "built_starter")}
            onDeselect={() =>
                setAttributes({ selectionMode: defaultSelectionMode })
            }
            isShownByDefault={isShownByDefault}
        >
            <ToggleGroupControl
                __next40pxDefaultSize={true}
                __nextHasNoMarginBottom
                label={__("Selection Mode", "built_starter")}
                value={selectionMode}
                onChange={handleSelectionModeChange}
                isBlock
            >
                <ToggleGroupControlOption
                    label={__("Auto", "built_starter")}
                    value="auto"
                />
                <ToggleGroupControlOption
                    label={__("Manual", "built_starter")}
                    value="manual"
                />
            </ToggleGroupControl>
        </ToolsPanelItem>
    );
}

export { SelectionModeControl };
