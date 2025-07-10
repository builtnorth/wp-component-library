/**
 * WordPress dependencies
 */
import {
    Button,
    Card,
    CardBody,
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { arrowDown, arrowUp, plus, trash } from "@wordpress/icons";
import PropTypes from "prop-types";

import "./index.scss";

/**
 * Card Repeater Component
 *
 * A reusable component for creating repeatable card-based forms with drag-and-drop reordering.
 * Follows WordPress admin UI patterns using Card and Toolbar components.
 *
 * @param {Object} props Component props
 * @param {Array} props.items Array of items to render
 * @param {Function} props.renderItem Function to render the content inside each card
 * @param {Function} props.onAdd Callback when add button is clicked
 * @param {Function} props.onRemove Callback when remove button is clicked (receives item id)
 * @param {Function} props.onMove Callback when item is moved up or down (receives index and direction)
 * @param {Function} props.getItemTitle Function to get the title for the toolbar (receives item)
 * @param {Function} props.getItemIcon Function to get the icon for the toolbar (receives item)
 * @param {string} props.addButtonText Text for the add button
 * @param {string} props.emptyStateText Text to show when no items exist
 * @param {string} props.className Additional CSS classes
 * @param {string} props.itemClassName Additional CSS classes for each item
 * @param {boolean} props.showEmptyState Whether to show empty state message
 */
function CardRepeater({
    items = [],
    renderItem,
    onAdd,
    onRemove,
    onMove,
    getItemTitle,
    getItemIcon,
    addButtonText = __("Add Item", "polaris"),
    emptyStateText = __(
        "No items added yet. Click the button above to add your first item.",
        "polaris",
    ),
    className = "",
    itemClassName = "",
    showEmptyState = true,
}) {
    /**
     * Handle moving an item up or down
     */
    const handleMove = (index, direction) => {
        const newIndex = direction === "up" ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= items.length) {
            return;
        }

        onMove(index, direction);
    };

    /**
     * Get the default title for an item
     */
    const getDefaultTitle = (item, index) => {
        if (getItemTitle) {
            return getItemTitle(item, index);
        }
        return __("Item", "polaris");
    };

    /**
     * Get the default icon for an item
     */
    const getDefaultIcon = (item, index) => {
        if (getItemIcon) {
            return getItemIcon(item, index);
        }
        return null;
    };

    return (
        <div className={`card-repeater ${className}`}>
            {items.length > 0 && (
                <div className="card-repeater__items">
                    {items.map((item, index) => (
                        <Card
                            key={item.id}
                            className={`card-repeater__item ${itemClassName}`}
                        >
                            <CardBody>
                                <Toolbar
                                    label={__(
                                        "Card Repeater Toolbar",
                                        "polaris",
                                    )}
                                    className="card-repeater__toolbar"
                                    style={{ marginBottom: "1rem" }}
                                >
                                    <ToolbarGroup>
                                        <ToolbarButton
                                            title={getDefaultTitle(item, index)}
                                            text={getDefaultTitle(item, index)}
                                            disabled={true}
                                        />
                                    </ToolbarGroup>
                                    <ToolbarGroup>
                                        {index > 0 && (
                                            <ToolbarButton
                                                icon={arrowUp}
                                                title={__("Move Up", "polaris")}
                                                onClick={() =>
                                                    handleMove(index, "up")
                                                }
                                            />
                                        )}
                                    </ToolbarGroup>
                                    {index < items.length - 1 && (
                                        <ToolbarGroup>
                                            <ToolbarButton
                                                icon={arrowDown}
                                                title={__(
                                                    "Move Down",
                                                    "polaris",
                                                )}
                                                onClick={() =>
                                                    handleMove(index, "down")
                                                }
                                            />
                                        </ToolbarGroup>
                                    )}
                                    <ToolbarGroup>
                                        <ToolbarButton
                                            icon={trash}
                                            title={__("Delete", "polaris")}
                                            isDestructive={true}
                                            onClick={() => onRemove(item.id)}
                                        />
                                    </ToolbarGroup>
                                </Toolbar>

                                <div className="card-repeater__content">
                                    {renderItem(item, index)}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {items.length === 0 && showEmptyState && (
                <div className="card-repeater__empty-state">
                    <p>{emptyStateText}</p>
                </div>
            )}

            <div className="card-repeater__add-button">
                <Button
                    icon={plus}
                    onClick={onAdd}
                    variant="secondary"
                    style={{
                        marginTop: items.length > 0 ? "12px" : "0",
                    }}
                >
                    {items.length === 0
                        ? addButtonText.replace("Add Another", "Add Your First")
                        : addButtonText}
                </Button>
            </div>
        </div>
    );
}

CardRepeater.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
        }),
    ).isRequired,
    renderItem: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    getItemTitle: PropTypes.func,
    getItemIcon: PropTypes.func,
    addButtonText: PropTypes.string,
    emptyStateText: PropTypes.string,
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    showEmptyState: PropTypes.bool,
};

export default CardRepeater;
