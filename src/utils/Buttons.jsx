import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Chip, IconButton } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // Import the new icon

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

export function DrawerCloseButton({ setIsVisible }) {
	return (
		<div className="close-btn__container--drawer">
			<IconButton
				color="white"
				aria-label="close drawer"
				onClick={() => setIsVisible(false)}
				disableElevation
				disableRipple
				disableFocusRipple
			>
				<ChevronRightIcon />
			</IconButton>
		</div>
	);
}
