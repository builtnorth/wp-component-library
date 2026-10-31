/**
 * Stepper Component
 *
 * Numbered steps joined by a line, with a check on finished ones. Each item
 * carries its own state, so steps can finish in any order. A line only takes
 * the accent color when it leads somewhere the user has reached.
 *
 * @package WPComponentLibrary
 */

import styled from "@emotion/styled";
import { VisuallyHidden } from "@wordpress/components";
import { check, Icon } from "@wordpress/icons";

const ACCENT = "var(--wp-admin-theme-color, #3858e9)";
const BORDER = "#e0e0e0";

const List = styled.ol`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
`;

const Item = styled.li`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: ${({ $isLast }) => ($isLast ? "0 0 auto" : "1 1 auto")};
    min-width: 0;
    margin: 0;

    /* The line to the next step. */
    &::after {
        content: ${({ $isLast }) => ($isLast ? "none" : '""')};
        flex: 1;
        min-width: 8px;
        height: 1px;
        background: ${({ $reached }) => ($reached ? ACCENT : BORDER)};
    }
`;

const Number = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 600;
    box-sizing: border-box;
    border: 1px solid ${({ $state }) => ($state === "todo" ? BORDER : ACCENT)};
    background: ${({ $state }) =>
        ({
            current: ACCENT,
            done: `color-mix(in srgb, ${ACCENT} 12%, #fff)`,
        })[$state] || "#fff"};
    color: ${({ $state }) =>
        ({ current: "#fff", done: ACCENT })[$state] || "#757575"};

    svg {
        fill: currentColor;
    }
`;

/**
 * A single step circle: a check when done, otherwise its number.
 *
 * @param {Object} props
 * @param {string} props.state  'todo', 'current' or 'done'.
 * @param {number} props.number Number to show.
 * @return {JSX.Element} Step number.
 */
export function StepNumber({ state, number }) {
    return (
        <Number $state={state} aria-hidden="true">
            {state === "done" ? <Icon icon={check} size={16} /> : number}
        </Number>
    );
}

/**
 * Stepper Component
 *
 * @param {Object}                                             props
 * @param {Array<{key: string, label: string, state: string}>} props.items       Steps in order. `label` is for screen readers only; `state` is 'todo', 'current' or 'done'.
 * @param {string}                                             [props.className] Additional CSS classes.
 * @return {JSX.Element} Stepper.
 */
export function Stepper({ items, className = "" }) {
    return (
        <List className={`siratik-stepper ${className}`.trim()}>
            {items.map((item, index) => {
                const next = items[index + 1];

                return (
                    <Item
                        key={item.key}
                        $isLast={!next}
                        $reached={item.state === "done" && next?.state !== "todo"}
                        aria-current={item.state === "current" ? "step" : undefined}
                    >
                        <StepNumber state={item.state} number={index + 1} />
                        <VisuallyHidden>{item.label}</VisuallyHidden>
                    </Item>
                );
            })}
        </List>
    );
}

export default Stepper;
