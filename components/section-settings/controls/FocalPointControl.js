/**
 * WordPress dependencies
 */
import {
    FocalPointPicker,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const FocalPointControl = ({
    focalPoint = null,
    onChange,
    imageUrl = null,
    isShownByDefault = false,
}) => {
    const defaultFocalPoint = { x: 0.5, y: 0.5 };

    if (!imageUrl) return null;

    return (
        <ToolsPanelItem
            hasValue={() => {
                if (!focalPoint) return false;
                return (
                    focalPoint.x !== defaultFocalPoint.x ||
                    focalPoint.y !== defaultFocalPoint.y
                );
            }}
            label={__("Media Focal Point", "wp-component-library")}
            onDeselect={() => onChange(defaultFocalPoint)}
            isShownByDefault={true}
        >
            <FocalPointPicker
                key={imageUrl}
                __nextHasNoMarginBottom
                hideLabelFromVision={true}
                label={__("Media Focal Point", "wp-component-library")}
                url={imageUrl}
                value={focalPoint || defaultFocalPoint}
                onDragStart={onChange}
                onDrag={onChange}
                onChange={onChange}
            />
        </ToolsPanelItem>
    );
};

export { FocalPointControl };
