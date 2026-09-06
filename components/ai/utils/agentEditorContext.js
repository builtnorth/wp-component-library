/**
 * Detect the post currently open in wp-admin (block editor or post.php).
 *
 * Used so “edit this page” can resolve without chat history.
 *
 * @package
 */

/**
 * @return {{ post_id?: number, post_type?: string, title?: string }}
 */
export function getAgentEditorContext() {
	if (typeof window === 'undefined') {
		return {};
	}

	try {
		const select = window.wp?.data?.select;
		if (typeof select === 'function') {
			const editor = select('core/editor');
			if (editor && typeof editor.getCurrentPostId === 'function') {
				const postId = editor.getCurrentPostId();
				if (postId) {
					const context = { post_id: Number(postId) };
					if (typeof editor.getCurrentPostType === 'function') {
						const type = editor.getCurrentPostType();
						if (type) {
							context.post_type = String(type);
						}
					}
					if (typeof editor.getEditedPostAttribute === 'function') {
						const title = editor.getEditedPostAttribute('title');
						if (title) {
							context.title = String(title);
						}
					}
					return context;
				}
			}
		}
	} catch {
		// Editor store may be unavailable outside the block editor.
	}

	try {
		const path = window.location?.pathname || '';
		if (!/post\.php$/i.test(path)) {
			return {};
		}
		const params = new URLSearchParams(window.location.search || '');
		const postId = parseInt(params.get('post') || '', 10);
		if (!postId || postId < 1) {
			return {};
		}
		const context = { post_id: postId };
		const postType = params.get('post_type');
		if (postType) {
			context.post_type = postType;
		}
		return context;
	} catch {
		return {};
	}
}
