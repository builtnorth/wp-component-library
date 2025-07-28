import { InspectorAdvancedControls } from "@wordpress/block-editor";
import { TextControl } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

const BaseMetaAdvanced = ({ metaField, onMetaFieldChange }) => {
    // Always render the panel with a text input for the meta key
    return (
        <InspectorAdvancedControls>
            <TextControl
                label={__("Meta Field Key", "wp-component-library")}
                value={metaField || ""}
                onChange={(value) => {
                    onMetaFieldChange(value);
                }}
                placeholder={__("Enter meta field key", "wp-component-library")}
                help={__(
                    "Advanced use only. Link this block to a post meta field. Depending on intended functionality, this may overide the block's content.",
                    "wp-component-library",
                )}
            />
        </InspectorAdvancedControls>
    );
};

const MetaAdvanced = compose([
    withSelect((select, ownProps) => {
        const { getBlockAttributes } = select("core/block-editor");
        const blockAttributes = getBlockAttributes(ownProps.clientId);
        return {
            metaField: blockAttributes?.metaField || "",
        };
    }),
    withDispatch((dispatch, ownProps) => {
        const { updateBlockAttributes } = dispatch("core/block-editor");

        return {
            onMetaFieldChange: (value) => {
                updateBlockAttributes(ownProps.clientId, { metaField: value });
            },
        };
    }),
])(BaseMetaAdvanced);

export { MetaAdvanced };
