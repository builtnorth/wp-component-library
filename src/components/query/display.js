import { PanelBody, RangeControl, SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Render the settings block used to select the post types.
 *
 * @since 0.1.0
 *
 * @returns {WPElement} Element to render.
 */
function QueryDisplay(props) {
	const {
		attributes: { postsPerPage, columnCount, displayAs },
		setAttributes,
	} = props;

	return (
		<PanelBody
			title={__("Display Options", "built_starter")}
			initialOpen={true}
		>
			<SelectControl
				label="Display As"
				value={displayAs}
				options={[
					{ label: "Grid", value: "grid" },
					{ label: "Slider", value: "slider" },
					{ label: "List", value: "list" },
				]}
				onChange={(value) => setAttributes({ displayAs: value })}
			/>

			<RangeControl
				label="Amount to Display"
				value={postsPerPage}
				onChange={(postsPerPageNew) =>
					setAttributes({ postsPerPage: postsPerPageNew })
				}
				min={1}
				max={12}
			/>
			{displayAs !== "list" && (
				<RangeControl
					label={
						displayAs == "grid"
							? __("Columns")
							: __("Slides to Show")
					}
					value={columnCount}
					onChange={(columnCountNew) =>
						setAttributes({ columnCount: columnCountNew })
					}
					min={1}
					max={4}
				/>
			)}
		</PanelBody>
	);
}

export { QueryDisplay };
