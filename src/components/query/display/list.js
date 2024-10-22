/**
 * ------------------------------------------------------------------
 * Block: Query List / Components / List
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
 * List Function
 */
function List(props) {
	const {
		attributes: { columnCount },
		posts,
		CardComponent,
		postType,
	} = props;

	const wrapClass = `${postType}-query ${postType}-query--list list list-has-${columnCount}`;

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
export default List;
