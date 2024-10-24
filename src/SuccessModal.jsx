import { Button, Divider } from "@mui/material";
import "./styles/dialogs.css";

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
						<div className="campaign-code">
							{campaignCode}
							{/* todo: add auto copy to clipboard when clicked? */}
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
		</dialog>
	);
}
