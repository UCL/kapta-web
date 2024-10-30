import { useState } from "react";
import CloseButton from "./CloseButton";
import { Button, TextField } from "@mui/material";
import { confirmSignUp } from "./auth";
import { useUserStore } from "../globals";

export default function ConfirmModal({
	isVisible,
	setIsVisible,
	recipient,
	setSuccessModalVisible,
}) {
	if (!isVisible) return null;
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const { code, recipient } = Object.fromEntries(formData);
		return confirmSignUp(code, recipient).then((response) => {
			if (response.statusCode === 200) {
				//might be Metadata.httpstatuscode
				setIsVisible(false);
				setSuccessModalVisible(true);
			}
		});
	};
	return (
		<>
			<dialog open id="confirm-dialog">
				<CloseButton setIsVisible={setIsVisible} />
				<h3>Confirm your account details</h3>
				<p>
					If you provided a phone number, you will receive a SMS with a code.
					Otherwise, you should receive an email with a code
				</p>
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
			</dialog>
		</>
	);
}
