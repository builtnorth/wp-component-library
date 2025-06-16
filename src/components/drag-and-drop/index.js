import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { arrowDown, arrowUp, plusCircle, trash } from "@wordpress/icons";
import PropTypes from "prop-types";
import React from "react";

/**
 * A list component that manages items with up/down reordering and an add button
 *
 * @param {Object} props
 * @param {Array} props.items - Array of items to be rendered
 * @param {Function} props.renderItem - Function to render each item's content
 * @param {Function} props.onAdd - Callback when add button is clicked
 * @param {Function} props.onRemove - Callback when remove button is clicked
 * @param {Function} props.onMove - Callback when item is moved up or down
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.addButtonText - Text for the add button
 * @param {string} props.emptyStateText - Text to show when list is empty
 */

import "./index.scss";

const ReorderableList = ({
    items = [],
    renderItem,
    onAdd,
    onRemove,
    onMove,
    className = "",
    addButtonText = __("Add Item", "polaris"),
    emptyStateText = __(
        "No items added yet. Click the button below to add one.",
        "polaris",
    ),
}) => {
    return (
        <div className={`polaris-reorderable-list ${className}`}>
            {items.length === 0 ? (
                <div className="polaris-reorderable-list__empty-state">
                    {emptyStateText}
                </div>
            ) : (
                <div className="polaris-reorderable-list__items">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="polaris-reorderable-list__item"
                        >
                            <div className="polaris-reorderable-list__item-controls">
                                <div className="polaris-reorderable-list__item-reorder">
                                    <Button
                                        size="compact"
                                        icon={arrowUp}
                                        iconSize={20}
                                        label={__("Move Up", "polaris")}
                                        variant="tertiary"
                                        onClick={() => onMove(index, "up")}
                                        disabled={index === 0}
                                    />
                                    <Button
                                        size="compact"
                                        icon={arrowDown}
                                        iconSize={20}
                                        label={__("Move Down", "polaris")}
                                        variant="tertiary"
                                        onClick={() => onMove(index, "down")}
                                        disabled={index === items.length - 1}
                                    />
                                </div>
                                <Button
                                    size="compact"
                                    label={__("Remove", "polaris")}
                                    icon={trash}
                                    iconSize={20}
                                    variant="tertiary"
                                    isDestructive={true}
                                    onClick={() => onRemove(item.id)}
                                />
                            </div>
                            <div className="polaris-reorderable-list__item-content">
                                {renderItem(item)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="polaris-reorderable-list__add-button">
                <Button
                    variant="secondary"
                    icon={plusCircle}
                    iconPosition="left"
                    onClick={onAdd}
                >
                    {addButtonText}
                </Button>
            </div>
        </div>
    );
};

ReorderableList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
        }),
    ).isRequired,
    renderItem: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    className: PropTypes.string,
    addButtonText: PropTypes.string,
    emptyStateText: PropTypes.string,
};

export { ReorderableList };
