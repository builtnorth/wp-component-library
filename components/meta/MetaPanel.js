/**
 * Meta Panel Component
 *
 * A reusable component for adding meta fields to the Gutenberg Document sidebar.
 * This component provides the core structure (modal, button) for meta panels.
 *
 * Usage:
 * ```jsx
 * <MetaPanel title="My Panel">
 *   <TextControl ... />
 *   <TextareaControl ... />
 * </MetaPanel>
 * ```
 */

import { Button, Modal } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { PluginPostStatusInfo } from "@wordpress/editor";
import { useState } from "@wordpress/element";

const MetaPanelBase = ({
    title,
    postType,
    children,
    buttonText = "Edit Meta Details",
    postMeta,
}) => {
    const [isOpen, setOpen] = useState(false);

    // Only show for specified post type
    if (postType && postType !== postMeta?.postType) return null;

    return (
        <>
            <PluginPostStatusInfo>
                <Button
                    __next40pxDefaultSize
                    variant="secondary"
                    onClick={() => setOpen(true)}
                    style={{ flexGrow: 1, justifyContent: "center" }}
                >
                    {buttonText}
                </Button>
            </PluginPostStatusInfo>
            {isOpen && (
                <Modal
                    title={title || "Meta Details"}
                    size="medium"
                    onRequestClose={() => setOpen(false)}
                >
                    <div style={{ padding: "16px" }}>{children}</div>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Modal>
            )}
        </>
    );
};

const MetaPanel = compose([
    withSelect((select) => {
        const { getCurrentPostType } = select("core/editor");
        
        return {
            postMeta: {
                postType: getCurrentPostType(),
            },
        };
    }),
])(MetaPanelBase);

export { MetaPanel };
