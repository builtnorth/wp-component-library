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
function Slider(props) {
	const {
		attributes: { columnCount, postsPerPage },
		posts,
		CardComponent,
		postType,
	} = props;

	const wrapClass = `${postType}-query ${postType}-query--slider slider slider-has-${postsPerPage}`;

	const blockProps = useBlockProps({
		className: wrapClass,
	});

	// Return
	return (
		<div {...blockProps}>
			<swiper-container
				simulate-touch="false"
				slides-per-view={columnCount}
				wrapperClass={`posts-${postsPerPage}`} // Tricks slider to refresh
				loop="true"
				pagination="true"
				navigation="true"
				space-between="32px"
			>
				{posts &&
					posts.map((post) => {
						return (
							<Fragment key={post.id}>
								<swiper-slide>
									<CardComponent
										post={post}
										postType={postType}
									/>
								</swiper-slide>
							</Fragment>
						);
					})}
			</swiper-container>
		</div>
	);
}
/**
 * Export Slider
 */
export default Slider;
