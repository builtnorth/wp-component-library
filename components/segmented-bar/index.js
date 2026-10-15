/**
 * SegmentedBar Component
 *
 * A row of equal segments, one per item, each in a status color — for
 * "3 of 4 on" style summaries where every part matters, not just the total.
 *
 * @package WPComponentLibrary
 */

import styled from "@emotion/styled";
import { statusColor } from "../../constants/statusColors";

const Track = styled.div`
    display: flex;
    gap: 4px;
    width: 100%;
`;

const Segment = styled.span`
    flex: 1;
    height: ${({ $height }) => $height}px;
    border-radius: ${({ $height }) => $height / 2}px;
    background: ${({ $color }) => $color};
`;

const NEUTRAL = "var(--wpds-color-background-surface-neutral-weak, #f0f0f0)";

/**
 * Color for a segment intent.
 *
 * @param {string} intent 'success', 'warning', 'error', 'info' or 'default'.
 * @return {string} CSS color.
 */
function segmentColor(intent) {
    return ["success", "warning", "error", "info"].includes(intent)
        ? statusColor(intent, "fill")
        : NEUTRAL;
}

/**
 * SegmentedBar Component
 *
 * @param {Object}                                  props
 * @param {Array<{key: string, intent: string}>}    props.segments    One segment each, in order.
 * @param {string}                                  props.label       Accessible summary, e.g. "Firewall: 3 of 4 on".
 * @param {number}                                  [props.height=6]  Segment height in px.
 * @param {string}                                  [props.className] Additional CSS classes.
 * @return {JSX.Element} Segmented bar.
 */
export function SegmentedBar({ segments, label, height = 6, className = "" }) {
    return (
        <Track
            role="img"
            aria-label={label}
            className={`siratik-segmented-bar ${className}`.trim()}
        >
            {segments.map((segment) => (
                <Segment
                    key={segment.key}
                    $height={height}
                    $color={segmentColor(segment.intent)}
                />
            ))}
        </Track>
    );
}

export default SegmentedBar;
