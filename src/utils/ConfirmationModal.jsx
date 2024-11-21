import { CloseButton } from "./Buttons";
import { Button, TextField } from "@mui/material";
import { confirmSignUp, resendVerificationCode } from "./auth";

export default function ConfirmModal({
	isVisible,
	setIsVisible,
	recipient,
	showLoginSuccessModal,
}) {
	if (!isVisible) return null;
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const { code, recipient } = Object.fromEntries(formData);
		// this isn't getting the username through signup
		return confirmSignUp(code, recipient).then((response) => {
			if (response.$metadata.httpStatusCode === 200) {
				setIsVisible(false);

				showLoginSuccessModal(
					"Thank you for confirming. You may proceed to log in."
				);
			}
		});
	};
	const handleNewCodeRequest = () => {
		resendVerificationCode(recipient);
	};
	return (
		<>
			<dialog open id="confirm-dialog" className="dialog">
				<CloseButton setIsVisible={setIsVisible} />
				<h3>Confirm your account details</h3>
				<p>Check your email for a verification code. It may be in spam.</p>
				<form onSubmit={handleSubmit}>
					<TextField
						size="small"
						type="text"
						name="code"
						label="Code"
						className="code-input"
					/>
					<input type="hidden" name="recipient" value={recipient} />
					<Button variant="contained" type="submit">
						Submit
					</Button>
				</form>
				<Button
					className="new-code"
					variant="text"
					size="small"
					onClick={handleNewCodeRequest}
				>
					Request a new code
				</Button>
			</dialog>
		</>
	);
}
