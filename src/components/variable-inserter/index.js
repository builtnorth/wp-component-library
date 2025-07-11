import { Button, Popover } from "@wordpress/components";
import { useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Icon, plusCircle } from "@wordpress/icons";

/**
 * VariableInserter Component
 *
 * A reusable component for inserting variable tags into text fields.
 * Similar to Yoast's variable inserter but more flexible and customizable.
 *
 * @param {Object} props Component props
 * @param {Array} props.variables Array of variable objects with label and value properties
 * @param {string} props.currentValue Current value of the text field
 * @param {Function} props.onChange Function to call when a variable is inserted
 * @param {Object} props.buttonProps Props to pass to the button component
 * @param {string} props.placeholder Placeholder text for the button
 * @param {string} props.className Additional CSS classes
 * @param {string} props.size Button size ('small', 'medium', 'large')
 * @param {string} props.variant Button variant ('primary', 'secondary', 'tertiary')
 */
const VariableInserter = ({
    variables = [],
    currentValue = "",
    onChange,
    buttonProps = {},
    placeholder = __("Insert Variable", "wp-component-library"),
    className = "",
    size = "small",
    variant = "tertiary",
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);

    const handleVariableClick = (variable) => {
        const newValue = currentValue + variable.value;
        onChange(newValue);
        setIsOpen(false);
    };

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className={`variable-inserter ${className}`} {...props}>
            <Button
                ref={buttonRef}
                icon={<Icon icon={plusCircle} />}
                label={placeholder}
                onClick={handleButtonClick}
                size={size}
                variant={variant}
                {...buttonProps}
            />

            {isOpen && (
                <Popover
                    anchor={buttonRef.current}
                    onClose={handleClose}
                    placement="bottom-start"
                    className="variable-inserter__popover"
                >
                    <div className="variable-inserter__variables">
                        {variables.length === 0 ? (
                            <div className="variable-inserter__empty">
                                {__(
                                    "No variables available",
                                    "wp-component-library",
                                )}
                            </div>
                        ) : (
                            variables.map((variable) => (
                                <Button
                                    key={variable.value}
                                    onClick={() =>
                                        handleVariableClick(variable)
                                    }
                                    variant="tertiary"
                                    size="small"
                                    className="variable-inserter__variable"
                                >
                                    <span className="variable-inserter__variable-label">
                                        {variable.label}
                                    </span>
                                </Button>
                            ))
                        )}
                    </div>
                </Popover>
            )}
        </div>
    );
};

export default VariableInserter;
