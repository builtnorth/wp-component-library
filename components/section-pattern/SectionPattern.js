/**
 * WordPress dependencies
 */
import { useEffect, useState } from "@wordpress/element";
import classnames from "classnames";

const SectionPattern = ({
    pattern = null,
    patternAlign = "center center",
    className = "",
}) => {
    const [svgContent, setSvgContent] = useState("");

    useEffect(() => {
        if (!pattern) {
            setSvgContent("");
            return;
        }

        // Get pattern configuration - check if we need to load parent theme config
        let patternConfig = window.polaris_localize?.blocks?.editor_experience?.patterns;
        
        // For child themes, if pattern config is not available or pattern not in available_patterns,
        // we should still try to load the pattern in case it's available in the parent theme
        const isChildTheme = window.polaris_localize?.theme_urls?.is_child_theme;
        
        if (!patternConfig?.enabled || (!patternConfig?.available_patterns?.[pattern] && !isChildTheme)) {
            setSvgContent("");
            return;
        }

        // Build SVG URL
        const themeUrl = window.polaris_localize?.theme_url || window.polarisLocalizeShared?.theme_url;
        const parentThemeUrl = window.polaris_localize?.theme_urls?.template || window.polarisLocalizeShared?.theme_urls?.template;
        
        if (!themeUrl) {
            console.warn("Theme URL not found in polaris_localize");
            return;
        }

        const patternDirectory = patternConfig?.pattern_directory || "build/assets/background-patterns";
        const patternUrl = `${themeUrl}/${patternDirectory}/${pattern}.svg`;

        // Fetch SVG content with parent theme fallback
        fetch(patternUrl)
            .then((response) => {
                if (!response.ok) {
                    // If child theme pattern not found and we have a parent theme URL, try parent theme
                    if (response.status === 404 && parentThemeUrl && parentThemeUrl !== themeUrl) {
                        const parentPatternUrl = `${parentThemeUrl}/${patternDirectory}/${pattern}.svg`;
                        return fetch(parentPatternUrl);
                    }
                    throw new Error(`Failed to load pattern: ${response.statusText}`);
                }
                return response;
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load pattern from parent theme: ${response.statusText}`);
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

    // Convert alignment value to class name
    const alignmentToClass = (align) => {
        const alignmentMap = {
            "top left": "top-left",
            "top center": "top-center",
            "top right": "top-right",
            "center left": "center-left",
            "center center": "center-center",
            "center": "center-center",
            "center right": "center-right",
            "bottom left": "bottom-left",
            "bottom center": "bottom-center",
            "bottom right": "bottom-right",
        };
        return alignmentMap[align] || "center-center";
    };

    const patternClasses = classnames("section-pattern", className, {
        [`has-pattern-${pattern}`]: pattern,
        [`pattern-align--${alignmentToClass(patternAlign)}`]: patternAlign,
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