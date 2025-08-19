/**
 * AI Generator Component
 *
 * Minimal UI component that uses registered AI types
 */

import apiFetch from "@wordpress/api-fetch";
import { Button, TextareaControl } from "@wordpress/components";
import { useDispatch } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { aiSparkle } from "./icons";

/**
 * AI Generator Component
 *
 * @param {Object} props
 * @param {string} props.type - Content type ID (required)
 * @param {*} props.value - Current value
 * @param {Function} props.onChange - Value change handler (required)
 * @param {string} props.mode - UI mode: auto|button|prompt
 * @param {Object} props.context - Context for generation
 * @param {Function} props.onError - Optional error handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.buttonText - Override button text
 * @param {string|Object} props.icon - Button icon (string name or icon object)
 * @param {string} props.size - Button size: 'small', 'compact', 'default'
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'tertiary', 'link'
 * @param {boolean} props.isDestructive - Makes button destructive variant
 * @param {Object} props.buttonProps - Additional props to pass to Button component
 */
export function AIGenerator({
	type,
	value,
	onChange,
	mode = "auto",
	context = {},
	onError,
	className,
	buttonText,
	icon,
	size,
	variant,
	isDestructive,
	buttonProps = {},
	...props
}) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [promptValue, setPromptValue] = useState("");
	const { createNotice } = useDispatch("core/notices");

	// Get type configuration from framework
	const typeConfig = window.AIContentFramework?.getType(type);

	if (!typeConfig) {
		console.error(`AI type "${type}" not registered`);
		return null;
	}

	// Let plugins customize the mode via filter
	const actualMode = wp.hooks.applyFilters("ai_generator_mode", mode, {
		type,
		context,
	});

	// Core generation logic
	const generate = async (customPrompt = null) => {
		setIsGenerating(true);

		try {
			// Extract content using type's method
			const extracted = typeConfig.extractContent(context);

			// Build prompt using type's method
			let prompt = typeConfig.buildPrompt(extracted, {
				customPrompt,
				currentValue: value,
				context,
			});

			// Allow customization via filters
			prompt = wp.hooks.applyFilters("ai_generator_prompt", prompt, {
				type,
				context,
				extracted,
			});

			// Make request to framework endpoint
			const endpoint = wp.hooks.applyFilters(
				"ai_generator_endpoint",
				"/polaris/v1/ai/generate",
			);
			const requestData = wp.hooks.applyFilters("ai_generator_request", {
				prompt,
				context: { type, ...context },
				options: {
					temperature: typeConfig.temperature,
					max_tokens: typeConfig.maxTokens,
				},
			});

			const response = await apiFetch({
				path: endpoint,
				method: "POST",
				data: requestData,
			});

			if (response.text) {
				// Validate using type's validator
				const validation = typeConfig.validateOutput(response.text);
				if (!validation.valid) {
					throw new Error(
						validation.error ||
							__("Validation failed", "wp-component-library"),
					);
				}

				// Post-process using type's processor
				let processed = typeConfig.postProcess(response.text);

				// Final filter for customization
				processed = wp.hooks.applyFilters(
					"ai_generator_output",
					processed,
					{
						type,
						context,
						raw: response.text,
					},
				);

				onChange(processed);
				wp.hooks.doAction("ai_generator_success", {
					type,
					value: processed,
				});
			}
		} catch (err) {
			const errorMessage =
				err.message || __("Generation failed", "wp-component-library");

			// Create snackbar notification using WordPress notices
			createNotice("error", errorMessage, {
				type: "snackbar",
				isDismissible: true,
				actions: [
					{
						label: __("Try Again", "wp-component-library"),
						onClick: () => generate(customPrompt),
					},
				],
			});

			onError?.(err);
			wp.hooks.doAction("ai_generator_error", { type, error: err });
		} finally {
			setIsGenerating(false);
		}
	};

	// Button mode - simplest UI
	if (actualMode === "button") {
		// Determine button text - priority: explicit prop > type config > default
		// If buttonText is explicitly set to empty string, don't show text
		const displayText =
			buttonText !== undefined
				? isGenerating && buttonText === ""
					? ""
					: isGenerating
						? __("Generating...", "wp-component-library")
						: buttonText
				: isGenerating
					? __("Generating...", "wp-component-library")
					: typeConfig.buttonLabel ||
						__("Generate", "wp-component-library");

		// Always use our custom AI sparkle icon - no overrides allowed
		const displayIcon = aiSparkle;

		// Determine icon size based on button size
		const getIconSize = () => {
			switch (size) {
				case "compact":
					return 18;
				case "small":
					return 16;
				default:
					return 20;
			}
		};

		// Clone icon with proper size
		const sizedIcon = displayIcon && (
			<svg
				{...displayIcon.props}
				width={getIconSize()}
				height={getIconSize()}
			/>
		);

		// Determine variant - priority: prop > button props > default
		const displayVariant = variant || buttonProps.variant || "secondary";

		console.log("AIGenerator Button props:", {
			receivedSize: size,
			passedToButton: size,
			variant,
			displayVariant,
			buttonText,
			displayText,
			buttonProps,
			mode,
			actualMode,
			allProps: { size, variant, buttonText, ...buttonProps },
		});

		return (
			<Button
				{...buttonProps}
				className={className}
				variant={displayVariant}
				size={size}
				icon={sizedIcon}
				iconSize={getIconSize()}
				onClick={() => generate()}
				isBusy={isGenerating}
				disabled={isGenerating}
				isDestructive={isDestructive}
			>
				{displayText !== "" && displayText}
			</Button>
		);
	}

	// Prompt mode - with text input
	if (actualMode === "prompt") {
		return (
			<div className={`ai-generator-prompt ${className || ""}`}>
				<TextareaControl
					placeholder={
						typeConfig.promptPlaceholder ||
						__(
							"Describe what you want to generate...",
							"wp-component-library",
						)
					}
					value={promptValue}
					onChange={setPromptValue}
					help={typeConfig.description}
					onKeyDown={(e) => {
						if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
							generate(promptValue);
						}
					}}
				/>
				<Button
					variant="primary"
					onClick={() => generate(promptValue)}
					isBusy={isGenerating}
					disabled={isGenerating || !promptValue}
				>
					{isGenerating
						? __("Generating...", "wp-component-library")
						: __("Generate", "wp-component-library")}
				</Button>
			</div>
		);
	}

	// Let plugins handle other modes via filter
	const customRender = wp.hooks.applyFilters("ai_generator_render", null, {
		mode: actualMode,
		type,
		typeConfig,
		generate,
		isGenerating,
		value,
		onChange,
		createNotice,
	});

	if (customRender !== null) {
		return customRender;
	}

	// Fallback to button mode if unrecognized
	return (
		<AIGenerator
			{...props}
			type={type}
			value={value}
			onChange={onChange}
			mode="button"
			context={context}
		/>
	);
}
