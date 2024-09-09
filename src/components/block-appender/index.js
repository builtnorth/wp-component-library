// WordPress dependencies.
import { Inserter } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Icon, plus } from "@wordpress/icons";

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

export { CustomBlockAppender, CustomInspectorAppender };
