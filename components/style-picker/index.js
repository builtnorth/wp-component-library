/**
 * StylePicker Component
 *
 * One option out of a few, shown like core's block Styles panel: a two-column
 * grid of buttons, the chosen one filled. For a block setting that reads as a
 * style but isn't a block style (an attribute such as a button variant).
 *
 * It renders core's own markup and classes (block-editor-block-styles__*), so
 * the block editor's styles apply and it matches the Styles panel exactly.
 *
 * @package WPComponentLibrary
 */

import {
    BaseControl,
    Button,
    __experimentalTruncate as Truncate,
} from "@wordpress/components";
import { useId } from "@wordpress/element";

/**
 * @param {Object}                                props
 * @param {string}                                props.label    Control label.
 * @param {string}                                [props.help]   Help text.
 * @param {string}                                props.value    The chosen option's value.
 * @param {Array<{value: string, label: string}>} props.options  Options, in order.
 * @param {Function}                              props.onChange Receives the chosen value.
 * @param {boolean}                               [props.hideLabelFromVision] Keep the label for screen readers only.
 * @param {string}                                [props.className]
 * @return {WPElement} The picker.
 */
export function StylePicker({
    label,
    help,
    value,
    options,
    onChange,
    hideLabelFromVision = false,
    className,
}) {
    const labelId = useId();

    return (
        <BaseControl
            __nextHasNoMarginBottom
            help={help}
            className={className}
        >
            {hideLabelFromVision ? (
                <span id={labelId} className="screen-reader-text">
                    {label}
                </span>
            ) : (
                <BaseControl.VisualLabel>
                    <span id={labelId}>{label}</span>
                </BaseControl.VisualLabel>
            )}
            <div
                className="block-editor-block-styles"
                role="group"
                aria-labelledby={labelId}
            >
                <div className="block-editor-block-styles__variants">
                    {options.map((option) => {
                        const isActive = option.value === value;

                        return (
                            <Button
                                key={option.value}
                                __next40pxDefaultSize
                                variant="secondary"
                                className={`block-editor-block-styles__item${
                                    isActive ? " is-active" : ""
                                }`}
                                label={option.label}
                                aria-current={isActive}
                                onClick={() => onChange(option.value)}
                            >
                                <Truncate
                                    numberOfLines={1}
                                    className="block-editor-block-styles__item-text"
                                >
                                    {option.label}
                                </Truncate>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </BaseControl>
    );
}
