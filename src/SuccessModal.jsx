import { Button } from "@mui/material";
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
					<p>Request ID: {taskID}</p>
					<p>Task title:{taskTitle}</p>
					<p>Task description:{taskDescription}</p>
					<div>
						<p>
							Below is the campaign code for people to access your study on
							Kapta Mobile and contribute to it.
						</p>
						<div className="campaign-code">{campaignCode}</div>
					</div>
				</>
			)}
			<Button variant="contained" onClick={() => setSuccessModalVisible(false)}>
				Close
			</Button>
		</dialog>
	);
}
