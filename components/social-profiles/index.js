import styled from "@emotion/styled";
import { ComboboxControl, Icon, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
	FaFacebook,
	FaGithub,
	FaInstagram,
	FaLink,
	FaLinkedin,
	FaMedium,
	FaPinterest,
	FaStrava,
	FaTiktok,
	FaTwitch,
	FaTwitter,
	FaVimeo,
	FaWordpress,
	FaYoutube,
} from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { DragHandle, RemoveButton, Repeater } from "../repeater";

// An even split: sized by content, the open platform list would widen its column.
const Fields = styled.div`
	.wpcl-repeater__item--integrated > .built-combobox-control-wrap,
	.wpcl-repeater__item--integrated > .social-media__url {
		flex: 1 1 0;
		min-width: 0;
	}
`;

const Hint = styled.p`
	margin: 0 0 1rem 0;
	font-size: 13px;
	color: #757575;
`;

const PlatformLabel = styled.span`
	display: flex;
	align-items: center;
	gap: 0.5rem;

	svg {
		opacity: 0.5;
	}
`;

const platformIcons = {
	generic: FaLink,
	facebook: FaFacebook,
	instagram: FaInstagram,
	linkedin: FaLinkedin,
	threads: FaThreads,
	pinterest: FaPinterest,
	tiktok: FaTiktok,
	twitter: FaTwitter,
	twitch: FaTwitch,
	youtube: FaYoutube,
	github: FaGithub,
	strava: FaStrava,
	wordpress: FaWordpress,
	medium: FaMedium,
	vimeo: FaVimeo,
};

const generateId = () =>
	"sm_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

/**
 * A list of social profiles ({ id, platform, url }): each platform once,
 * custom links as often as needed. Controlled; the caller stores the value.
 *
 * @param {Object}   props
 * @param {Array}    props.value     The profiles.
 * @param {Function} props.onChange  ( profiles ) => void
 * @param {string}   props.className Additional CSS classes.
 */
export function SocialProfilesControl({
	value,
	onChange,
	className = "",
	...props
}) {
	const profiles = Array.isArray(value) ? value : [];

	const platformsInUse = profiles
		.filter((item) => item.platform && item.platform !== "generic")
		.map((item) => item.platform);

	const getPlatformOptions = (currentPlatform) => {
		const baseOptions = [
			{
				disabled: true,
				label: __("Select a platform", "wp-component-library"),
				value: "",
			},
			{
				value: "generic",
				label: __("Custom link", "wp-component-library"),
			},
			{ value: "facebook", label: "Facebook" },
			{ value: "instagram", label: "Instagram" },
			{ value: "linkedin", label: "LinkedIn" },
			{ value: "threads", label: "Threads" },
			{ value: "pinterest", label: "Pinterest" },
			{ value: "tiktok", label: "TikTok" },
			{ value: "twitter", label: "Twitter" },
			{ value: "twitch", label: "Twitch" },
			{ value: "youtube", label: "YouTube" },
			{ value: "github", label: "GitHub" },
			{ value: "strava", label: "Strava" },
			{ value: "wordpress", label: "WordPress" },
			{ value: "medium", label: "Medium" },
			{ value: "vimeo", label: "Vimeo" },
		];

		return baseOptions.map((option) => {
			if (
				option.value === "" ||
				option.value === "generic" ||
				option.value === currentPlatform
			) {
				return option;
			}
			if (platformsInUse.includes(option.value)) {
				return {
					...option,
					label: `${option.label} (Already added)`,
					disabled: true,
				};
			}
			return option;
		});
	};

	const updateProfile = (itemId, field, fieldValue) => {
		onChange(
			profiles.map((item) =>
				item.id === itemId ? { ...item, [field]: fieldValue } : item,
			),
		);
	};

	const renderProfile = (item) => (
		<>
			<DragHandle />
			<div className="built-combobox-control-wrap">
				<ComboboxControl
					__nextHasNoMarginBottom={true}
					__next40pxDefaultSize={true}
					className="social-media__platform"
					allowReset={false}
					expandOnFocus={false}
					label={
						<PlatformLabel>
							{__("Platform", "wp-component-library")}
							{item.platform && platformIcons[item.platform] && (
								<Icon
									icon={platformIcons[item.platform]}
									size={16}
								/>
							)}
						</PlatformLabel>
					}
					value={item.platform}
					options={getPlatformOptions(item.platform)}
					onChange={(platform) =>
						updateProfile(item.id, "platform", platform)
					}
				/>
			</div>
			<TextControl
				__nextHasNoMarginBottom={true}
				__next40pxDefaultSize={true}
				className={
					item.platform
						? "social-media__url"
						: "social-media__url is-disabled"
				}
				type="url"
				placeholder={
					item.platform
						? "https://platform.com/profile"
						: __("Select a platform first", "wp-component-library")
				}
				label={__("URL", "wp-component-library")}
				value={item.url || ""}
				onChange={(url) => updateProfile(item.id, "url", url)}
				disabled={!item.platform}
			/>
			<RemoveButton />
		</>
	);

	return (
		<Fields
			className={`social-media-repeater-field ${className}`}
			{...props}
		>
			<Hint>
				{__(
					"Add each platform once. You can add several custom links.",
					"wp-component-library",
				)}
			</Hint>
			<Repeater
				items={profiles}
				renderItem={renderProfile}
				onAdd={() =>
					onChange([
						...profiles,
						{ id: generateId(), platform: "", url: "" },
					])
				}
				onRemove={(itemId) =>
					onChange(profiles.filter((item) => item.id !== itemId))
				}
				onReorder={onChange}
				renderMode="integrated"
				addButtonText={__("Add profile", "wp-component-library")}
				emptyStateText={__("No profiles yet.", "wp-component-library")}
			/>
		</Fields>
	);
}
