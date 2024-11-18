import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton } from "@mui/material";
import "../styles/utils.css";
export default function CloseButton({ setIsVisible }) {
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
