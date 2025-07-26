/**
 * WordPress dependencies
 */
import { useEffect, useState } from "@wordpress/element";
import classnames from "classnames";

const SectionPattern = ({
    pattern = null,
    className = "",
}) => {
    const [svgContent, setSvgContent] = useState("");

    useEffect(() => {
        if (!pattern) {
            setSvgContent("");
            return;
        }

        // Get pattern configuration
        const patternConfig = window.polaris_localize?.blocks?.editor_experience?.patterns;
        if (!patternConfig?.enabled || !patternConfig?.available_patterns?.[pattern]) {
            setSvgContent("");
            return;
        }

        // Build SVG URL
        const themeUrl = window.polaris_localize?.theme_url || window.polarisLocalizeShared?.theme_url;
        if (!themeUrl) {
            console.warn("Theme URL not found in polaris_localize");
            return;
        }

        const patternDirectory = patternConfig.pattern_directory || "assets/patterns";
        const patternUrl = `${themeUrl}/${patternDirectory}/${pattern}.svg`;

        // Fetch SVG content
        fetch(patternUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load pattern: ${response.statusText}`);
                }
                return response.text();
            })
            .then((svg) => {
                setSvgContent(svg);
            })
            .catch((error) => {
                console.error(`Error loading pattern ${pattern}:`, error);
                setSvgContent("");
            });
    }, [pattern]);

    if (!pattern || !svgContent) return null;

    const patternClasses = classnames("section-pattern", className, {
        [`has-pattern-${pattern}`]: pattern,
    });

    return (
        <div 
            className={patternClasses} 
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};

export { SectionPattern };