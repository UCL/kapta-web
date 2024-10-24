import { Button, Divider, Snackbar } from "@mui/material";
import "./styles/dialogs.css";
import { useState } from "react";
import { copyToClipboard } from "./utils/copyToClipboard";

export default function SuccessModal({
	taskID = "",
	taskTitle = "",
	taskDescription = "",
	campaignCode = "",
	setSuccessModalVisible,
	isTask,
}) {
	// if it's a not a task, the title will come through as taskTitle
	let title;
	if (isTask) title = "Your submission has been successful. See details below";
	else title = taskTitle;

	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const handleCopy = async (text) => {
		const success = await copyToClipboard(text);
		if (success) {
			setSnackbarOpen(true);
		}
	};
	return (
		<dialog open id="success-dialog">
			<h3>{title}</h3>
			{isTask && (
				<>
					{" "}
					<div className="task-info__container">
						<p className="task-info">
							<strong>{taskTitle}</strong> <small>{taskID}</small>
						</p>
						<p className="task-info">{taskDescription}</p>
					</div>
					<div>
						<Divider />
						<p>
							Below is the campaign code for people to access your study on{" "}
							Kapta Mobile and contribute to it.
						</p>
						<div
							className="campaign-code"
							onClick={() => handleCopy(campaignCode)}
						>
							{campaignCode}
						</div>
					</div>
				</>
			)}
			<Button
				variant="contained"
				color="secondary"
				onClick={() => setSuccessModalVisible(false)}
			>
				Close
			</Button>

			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={snackbarOpen}
				autoHideDuration={2000}
				onClose={() => setSnackbarOpen(false)}
				message="Code copied to clipboard!"
			/>
		</dialog>
	);
}
