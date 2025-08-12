import { __experimentalToolsPanel as ToolsPanel } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
    ColumnCountControl,
    DisplayTypeSelect,
    ManualPostSelector,
    OrderBySelect,
    PostsPerPageControl,
    PostTypeSelect,
    SelectionModeControl,
    TaxonomySelect,
    TermSelector,
} from "./";

/**
 * Example: Basic Post Query Interface
 * Simple interface with just post selection and ordering
 */
export function BasicPostQueryExample({ attributes, setAttributes }) {
    const resetAll = () => {
        setAttributes({
            postType: "post",
            orderPostsBy: "date",
            orderPostsDirection: "desc",
        });
    };

    return (
        <ToolsPanel
            label={__("Post Query", "built_starter")}
            resetAll={resetAll}
        >
            <PostTypeSelect
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <OrderBySelect
                attributes={attributes}
                setAttributes={setAttributes}
            />
        </ToolsPanel>
    );
}

/**
 * Example: Advanced Query Interface with Manual Selection
 * Complete interface with manual post selection and taxonomy filtering
 */
export function AdvancedQueryExample({ attributes, setAttributes }) {
    const resetAll = () => {
        setAttributes({
            postType: "post",
            orderPostsBy: "date",
            orderPostsDirection: "desc",
            selectionMode: "auto",
            selectedPosts: [],
            selectedTaxonomy: "",
            selectedTerms: [],
        });
    };

    return (
        <ToolsPanel
            label={__("Advanced Query", "built_starter")}
            resetAll={resetAll}
        >
            <PostTypeSelect
                attributes={attributes}
                setAttributes={setAttributes}
            />

            <OrderBySelect
                attributes={attributes}
                setAttributes={setAttributes}
            />

            <SelectionModeControl
                attributes={attributes}
                setAttributes={setAttributes}
            />

            {attributes.selectionMode === "manual" && (
                <ManualPostSelector
                    attributes={attributes}
                    setAttributes={setAttributes}
                    postType={attributes.postType}
                />
            )}

            <TaxonomySelect
                attributes={attributes}
                setAttributes={setAttributes}
                postType={attributes.postType}
            />

            {attributes.selectedTaxonomy && (
                <TermSelector
                    attributes={attributes}
                    setAttributes={setAttributes}
                    selectedTaxonomy={attributes.selectedTaxonomy}
                />
            )}
        </ToolsPanel>
    );
}

/**
 * Example: Display Settings Interface
 * Just the display-related controls
 */
export function DisplaySettingsExample({ attributes, setAttributes }) {
    const resetAll = () => {
        setAttributes({
            displayAs: "grid",
            postsPerPage: 6,
            columnCount: 3,
        });
    };

    return (
        <ToolsPanel
            label={__("Display Settings", "built_starter")}
            resetAll={resetAll}
        >
            <DisplayTypeSelect
                attributes={attributes}
                setAttributes={setAttributes}
            />

            <PostsPerPageControl
                attributes={attributes}
                setAttributes={setAttributes}
            />

            <ColumnCountControl
                attributes={attributes}
                setAttributes={setAttributes}
            />
        </ToolsPanel>
    );
}

/**
 * Example: Raw Controls (No Panels)
 * Using controls without ToolsPanel wrappers
 */
export function RawControlsExample({ attributes, setAttributes }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <PostTypeSelect
                attributes={attributes}
                setAttributes={setAttributes}
            />

            <OrderBySelect
                attributes={attributes}
                setAttributes={setAttributes}
            />

            <DisplayTypeSelect
                attributes={attributes}
                setAttributes={setAttributes}
            />
        </div>
    );
}
