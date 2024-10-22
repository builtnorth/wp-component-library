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

import { useBlockProps } from "@wordpress/block-editor";
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

	const wrapClass = `query-${postType} query-${postType}--grid grid grid-has-${columnCount}`;

	const blockProps = useBlockProps({
		className: wrapClass,
	});

	// Return
	return (
		<div {...blockProps}>
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
