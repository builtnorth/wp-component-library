import { __ } from "@wordpress/i18n";

const aspectRatioOptions = [
    { label: __("Original", "polaris-blocks"), value: "original" },
    { label: __("16:9 (Extra Wide)", "polaris-blocks"), value: "16/9" },
    { label: __("4:3 (Wide)", "polaris-blocks"), value: "4/3" },
    { label: __("1:1 (Square)", "polaris-blocks"), value: "1/1" },
    { label: __("3:4 (Tall)", "polaris-blocks"), value: "3/4" },
    { label: __("9:16 (Extra Tall)", "polaris-blocks"), value: "9/16" },
];

export { aspectRatioOptions };
