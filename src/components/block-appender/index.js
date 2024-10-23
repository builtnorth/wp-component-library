// WordPress dependencies.
import { Inserter } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Icon, plus } from "@wordpress/icons";

import { __ } from "@wordpress/i18n";

function CustomBlockAppender({
	rootClientId,
	appenderTitle,
	appenderLabel,
	appenderClassModifier,
}) {
	return (
		<Inserter
			__experimentalIsQuick
			rootClientId={rootClientId}
			renderToggle={({ onToggle, disabled }) => (
				<Button
					showTooltip={true}
					className={`built-block-appender built-block-appender--${appenderClassModifier} `}
					onClick={onToggle}
					disabled={disabled}
					label={appenderLabel}
				>
					<Icon icon={plus} />
					{appenderTitle}
				</Button>
			)}
			isAppender
		/>
	);
}

function CustomInspectorAppender({
	rootClientId,
	appenderTitle,
	appenderLabel,
	appenderClassModifier,
}) {
	return (
		<Inserter
			__experimentalIsQuick
			rootClientId={rootClientId}
			renderToggle={({ onToggle, disabled }) => (
				<Button
					className={`built-block-appender built-block-appender--${appenderClassModifier} `}
					onClick={onToggle}
					disabled={disabled}
					label={appenderLabel}
					variant="secondary"
				>
					<Icon icon={plus} />
					{appenderTitle}
				</Button>
			)}
			isAppender
		/>
	);
}

const CustomInlineAppender = ({
	clientId,
	label = __("Add Block", "polaris-blocks"),
	blockName = "core/paragraph",
}) => (
	<Button
		className="block-list-appender__toggle"
		icon={plus}
		label={label}
		onClick={() => {
			const block = wp.blocks.createBlock(blockName);
			wp.data
				.dispatch("core/block-editor")
				.insertBlock(block, undefined, clientId);
		}}
	/>
);

export { CustomBlockAppender, CustomInlineAppender, CustomInspectorAppender };
