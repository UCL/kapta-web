import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Chip, IconButton } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";

import "../styles/utils.css";
export function CloseButton({ setIsVisible }) {
	return (
		<div className="close-btn__container">
			<IconButton
				color="white"
				aria-label="cancel"
				onClick={() => setIsVisible(false)}
			>
				<HighlightOffIcon />
			</IconButton>
		</div>
	);
}

export function PinButton({ isPinned, setIsPinned }) {
	return (
		<Chip
			onClick={() => setIsPinned(!isPinned)}
			size="small"
			variant={isPinned ? "filled" : "outlined"}
			icon={<PushPinIcon />}
			label={isPinned ? "Unpin" : "Pin"}
		></Chip>
	);
}
