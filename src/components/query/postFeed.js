import { Placeholder, Spinner } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { Pagination } from "../pagination/index.js";
import Grid from "./display/grid.js";
import List from "./display/list.js";
import Slider from "./display/slider.js";

const QueryPostFeed = (props) => {
	const {
		attributes: {
			orderPostsBy,
			orderPostsDirection,
			postsPerPage,
			displayAs,
			selectedTaxonomy,
			selectedTerms,
		},
		postType,
		CardComponent,
	} = props;

	// Fetch posts
	const posts = useSelect((select) => {
		const query = {
			per_page: postsPerPage || "9",
			orderby: orderPostsBy,
			order: orderPostsDirection,
			status: "publish",
			_embed: true,
		};

		if (selectedTaxonomy && selectedTerms.length > 0) {
			if (selectedTaxonomy === "category") {
				query.categories = selectedTerms.join(",");
			} else if (selectedTaxonomy === "post_tag") {
				query.tags = selectedTerms.join(",");
			} else {
				query[`${selectedTaxonomy}`] = selectedTerms.join(",");
			}
		}

		return select("core").getEntityRecords("postType", postType, query);
	});

	// Check if we have posts
	const hasPosts = Array.isArray(posts) && posts.length;

	if (!hasPosts) {
		return (
			<Placeholder label={__("Post Types", "built")}>
				{!Array.isArray(posts) ? (
					<Spinner />
				) : (
					__(
						"No posts found. Please add some, check the taxonomy filter settings, or remove this block.",
						"built",
					)
				)}
			</Placeholder>
		);
	}

	return (
		<Fragment>
			{displayAs === "slider" ? (
				<Slider
					{...props}
					posts={posts}
					postType={postType}
					CardComponent={CardComponent}
				/>
			) : displayAs === "list" ? (
				<List
					{...props}
					posts={posts}
					postType={postType}
					CardComponent={CardComponent}
				/>
			) : (
				<Grid
					{...props}
					posts={posts}
					postType={postType}
					isSearchResults={false}
					CardComponent={CardComponent}
				/>
			)}

			{!displayAs && posts.length > (postsPerPage || 9) && <Pagination />}
		</Fragment>
	);
};

export { QueryPostFeed };
