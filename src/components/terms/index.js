import { useSelect } from "@wordpress/data";

/**
 * Render the terms for a post.
 *
 * @param {Object} props Component properties
 * @param {number} props.postId Post ID
 * @param {string} props.taxonomy Taxonomy name
 * @param {boolean} props.taxonomyLink Whether to link the terms
 * @param {boolean} props.firstTermOnly Whether to display only the first term
 * @param {string} props.className Additional class for the term list or item
 * @returns {WPElement} Element to render
 */
function GetTerms({
	postId,
	taxonomy,
	taxonomyTerms,
	taxonomyLink = false,
	firstTermOnly = false,
	className = null,
}) {
	const { terms } = useSelect(
		(select) => {
			const store = select("core");
			const post = store.getEditedEntityRecord(
				"postType",
				"post",
				postId,
			);
			if (!post) return { terms: null };
			const termIds = taxonomyTerms || [];
			return {
				terms:
					termIds.length > 0
						? store.getEntityRecords("taxonomy", taxonomy, {
								include: termIds,
							})
						: null,
			};
		},
		[postId, taxonomy],
	);

	if (!terms || terms.length === 0) {
		return null;
	}

	const termsToRender = firstTermOnly ? [terms[0]] : terms;
	const WrapperTag = firstTermOnly ? "span" : "ul";
	const ItemTag = firstTermOnly ? "span" : "li";

	const wrapperClass = className ? `${className}__terms` : "query__terms";

	const renderTerm = (term) => {
		const name = term.name;
		const link = term.link;
		const termClass = className ? `${className}__term` : "query__term";

		const content = taxonomyLink ? (
			<a className={`${termClass}-link is-interior-link`} href={link}>
				{name}
			</a>
		) : (
			name
		);

		return (
			<ItemTag key={term.id} className={termClass}>
				{content}
			</ItemTag>
		);
	};

	return (
		<WrapperTag className={wrapperClass}>
			{termsToRender.map(renderTerm)}
		</WrapperTag>
	);
}

export { GetTerms };
