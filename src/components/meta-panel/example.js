/**
 * Example usage of the MetaPanel component
 */

import { registerPlugin } from "@wordpress/plugins";
import MetaPanel from "./index";

// Example configuration for a listing post type
const ListingMetaPanel = () => {
    const fields = [
        {
            name: "website_url",
            label: "Website URL",
            help: "Enter the website URL for this listing",
            type: "url",
            placeholder: "https://example.com",
        },
        {
            name: "hero_title",
            label: "Hero Title",
            help: "Enter the title for the hero section",
            type: "text",
            placeholder: "Enter hero title",
        },
        {
            name: "hero_intro",
            label: "Hero Introduction",
            help: "Enter the introduction text for the hero section",
            type: "textarea",
            placeholder: "Enter hero introduction text",
        },
        {
            name: "is_featured",
            label: "Featured Listing",
            help: "Toggle to mark this listing as featured",
            type: "toggle",
        },
        {
            name: "listing_type",
            label: "Listing Type",
            help: "Select the type of listing",
            type: "select",
            options: [
                { label: "Standard", value: "standard" },
                { label: "Premium", value: "premium" },
                { label: "Featured", value: "featured" },
            ],
        },
    ];

    return (
        <MetaPanel
            title="Listing Details"
            icon="admin-links"
            postType="polaris_listing"
            fields={fields}
        />
    );
};

// Register the plugin
registerPlugin("compass-listing-meta", {
    render: ListingMetaPanel,
});
