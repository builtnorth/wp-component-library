/**
 * Meta Panel Component
 *
 * A reusable component for adding meta fields to the Gutenberg Document sidebar.
 *
 * @param {Object} props Component properties
 * @param {string} props.title Panel title
 * @param {string} props.icon Panel icon (dashicon name)
 * @param {boolean} props.initialOpen Whether the panel should be open by default
 * @param {string} props.postType The post type this panel should appear for
 * @param {Array} props.fields Array of field configurations
 * @returns {WPElement} Meta panel component
 */

import { PanelRow } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { PluginDocumentSettingPanel } from "@wordpress/edit-post";

// Import field components
import {
    SelectControl,
    TextareaControl,
    TextControl,
    ToggleControl,
} from "@wordpress/components";

const MetaPanel = ({
    title,
    icon = "admin-generic",
    initialOpen = true,
    postType,
    fields = [],
    postMeta,
    setPostMeta,
}) => {
    // Only show for specified post type
    if (postType && postType !== postMeta?.postType) return null;

    // Render the appropriate field based on type
    const renderField = (field) => {
        const {
            name,
            label,
            help,
            type = "text",
            placeholder,
            options,
            value = postMeta?.[name] || "",
        } = field;

        const onChange = (newValue) => {
            setPostMeta({ [name]: newValue });
        };

        switch (type) {
            case "textarea":
                return (
                    <TextareaControl
                        key={name}
                        label={label}
                        help={help}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                );
            case "toggle":
                return (
                    <ToggleControl
                        key={name}
                        label={label}
                        help={help}
                        checked={value}
                        onChange={onChange}
                    />
                );
            case "select":
                return (
                    <SelectControl
                        key={name}
                        label={label}
                        help={help}
                        value={value}
                        options={options}
                        onChange={onChange}
                    />
                );
            case "url":
                return (
                    <TextControl
                        key={name}
                        type="url"
                        label={label}
                        help={help}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                );
            default:
                return (
                    <TextControl
                        key={name}
                        label={label}
                        help={help}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                );
        }
    };

    return (
        <PluginDocumentSettingPanel
            title={title}
            icon={icon}
            initialOpen={initialOpen}
        >
            {fields.map((field) => (
                <PanelRow key={field.name}>{renderField(field)}</PanelRow>
            ))}
        </PluginDocumentSettingPanel>
    );
};

export default compose([
    withSelect((select) => ({
        postMeta: {
            ...select("core/editor").getEditedPostAttribute("meta"),
            postType: select("core/editor").getCurrentPostType(),
        },
    })),
    withDispatch((dispatch) => ({
        setPostMeta(newMeta) {
            dispatch("core/editor").editPost({ meta: newMeta });
        },
    })),
])(MetaPanel);
