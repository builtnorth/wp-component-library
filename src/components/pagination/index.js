/**
 * Render the settings block used to select the post types.
 *
 * @since 0.1.0
 *
 * @returns {WPElement} Element to render.
 */
function Pagination() {
	return (
		<div className="pagination" aria-label="Navigate Between Archive Pages">
			<ul className="page-numbers">
				<li>
					<span aria-current="page" className="page-numbers current">
						<span className="sr-only">Page </span>1
					</span>
				</li>
				<li>
					<span className="page-numbers">
						<span className="sr-only">Page </span>2
					</span>
				</li>
				<li>
					<span className="next page-numbers">Next »</span>
				</li>
			</ul>
		</div>
	);
}

export default Pagination;
