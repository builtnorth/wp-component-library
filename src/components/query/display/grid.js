/**
 * ------------------------------------------------------------------
 * Block: Image Gallery Slider / Components / Slider
 * ------------------------------------------------------------------
 *
 *
 * @package built-starter
 * @since built_starter 1.0.0
 *
 */

import { Fragment } from "@wordpress/element";

/**
 * Slider Function
 */
function Grid(props) {
	const {
		attributes: { columnCount },
		posts,
		CardComponent,
		postType,
	} = props;

	const wrapClass = `grid grid-has-${columnCount}`;

	// Return
	return (
		<div className={wrapClass}>
			{posts &&
				posts.map((post) => {
					return (
						<Fragment key={post.id}>
							<CardComponent post={post} postType={postType} />
						</Fragment>
					);
				})}
		</div>
	);
}
/**
 * Export Grid
 */
export default Grid;
