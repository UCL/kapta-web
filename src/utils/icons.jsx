import { SvgIcon } from "@mui/material";

export const KaptaSVGIcon = (props) => (
	<SvgIcon
		{...props}
		viewBox="0 0 24 24"
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			alignSelf: "center",
		}}
	>
		<image
			href="/logo_green_transparent.svg"
			height="100%"
			width="100%"
			preserveAspectRatio="xMidYMid meet"
		/>
	</SvgIcon>
);
