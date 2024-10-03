import { Button } from "@mui/material";
import "./styles/request-form.css";

export default function SuccessModal({
	requestID,
	title,
	description,
	shortcode,
	setSuccessModalVisible,
}) {
	return (
		<dialog open id="success-dialog">
			<h3>Your submission has been successful. See details below</h3>
			<p>Request ID: {requestID}</p>
			<p>Request title:{title}</p>
			<p>Request description:{description}</p>
			<div>
				<p>
					Below is your access code for people to join your study and contribute
					to it.
				</p>
				<div className="access-code">{shortcode}</div>
			</div>
			<Button variant="contained" onClick={() => setSuccessModalVisible(false)}>
				Close
			</Button>
		</dialog>
	);
}
