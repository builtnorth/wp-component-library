import {
    SelectControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Standalone display type selection control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {Array} props.allowedDisplayOptions Allowed display options
 * @returns {WPElement} Element to render
 */
function DisplayTypeSelect({
    attributes: { displayAs },
    setAttributes,
    allowedDisplayOptions = ["grid", "slider", "list", "pills"],
}) {
    const defaultDisplayAs = "grid";

    const displayOptions = [
        { label: "Grid", value: "grid" },
        { label: "Slider", value: "slider" },
        { label: "List", value: "list" },
        { label: "Pills", value: "pills" },
    ].filter((option) => allowedDisplayOptions.includes(option.value));

    return (
        <ToolsPanelItem
            hasValue={() => displayAs !== defaultDisplayAs}
            label={__("Display Type", "built_starter")}
            onDeselect={() => setAttributes({ displayAs: defaultDisplayAs })}
            isShownByDefault={true}
        >
            <SelectControl
                label="Display As"
                value={displayAs}
                options={displayOptions}
                onChange={(value) => setAttributes({ displayAs: value })}
            />
        </ToolsPanelItem>
    );
}

export { DisplayTypeSelect };
