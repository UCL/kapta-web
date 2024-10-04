import { Button } from "@mui/material";
import "./styles/request-form.css";

export default function SuccessModal({
	taskID,
	title,
	description,
	campaignCode,
	setSuccessModalVisible,
}) {
	return (
		<dialog open id="success-dialog">
			<h3>Your submission has been successful. See details below</h3>
			<p>Request ID: {taskID}</p>
			<p>Task title:{title}</p>
			<p>Task description:{description}</p>
			<div>
				<p>
					Below is the campaign code for people to access your study on Kapta
					Mobile and contribute to it.
				</p>
				<div className="campaign-code">{campaignCode}</div>
			</div>
			<Button variant="contained" onClick={() => setSuccessModalVisible(false)}>
				Close
			</Button>
		</dialog>
	);
}
