import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import SuccessModal from "./SuccessModal";
import "./styles/forms.css";
import { initiateAuth } from "./utils/auth";
import { useUserStore } from "./globals";
import CloseButton from "./utils/CloseButton";
import ConfirmModal from "./utils/ConfirmationModal";
// import * as Yup from "yup";

export default function LoginForm({
	isVisible,
	setIsVisible,
	setSignUpVisible,
	setErrorMsg,
}) {
	const [successModalVisible, setSuccessModalVisible] = useState(false);
	const user = useUserStore();
	useTheme();
	const [confirmModalVisible, setConfirmModalVisible] = useState(false);
	const [email, setEmail] = useState(null);

	if (!isVisible) return null;

	// formik has built in props regarding submission so we don't need to define them ourselves
	const handleSubmit = async (values) => {
		const { email, password } = values;

		return initiateAuth(email, password).then(({ response }) => {
			if (response === 4359) {
				setIsVisible(false);
				setSignUpVisible(true);
				setErrorMsg("User details not found, please sign up");
			} else if (response === 4399) {
				setErrorMsg("Please confirm your account before logging in");
				setEmail(email);
				setConfirmModalVisible(true);
			} else {
				user.setUserDetails(response);
				setSuccessModalVisible(true);
				setIsVisible(false);
			}
		});
	};
	const initialValues = {
		email: "",
		password: "",
	};
	return (
		<>
			{successModalVisible && (
				<SuccessModal
					taskTitle={`Welcome back, ${user.displayName}`}
					setSuccessModalVisible={setSuccessModalVisible}
					isTask={false}
				/>
			)}

			{confirmModalVisible && (
				<ConfirmModal
					setConfirmModalVisible={setConfirmModalVisible}
					isVisible={confirmModalVisible}
					recipient={email}
					setSuccessModalVisible={setSuccessModalVisible}
				/>
			)}

			<div className="login__form--container">
				<CloseButton setIsVisible={setIsVisible} />
				<Formik onSubmit={handleSubmit} initialValues={initialValues}>
					{({ isSubmitting }) => (
						<Form className="form login__form">
							<Field
								type="email"
								name="email"
								label="Email Address"
								as={TextField}
								inputProps={{
									autoComplete: "current-email",
								}}
							/>
							<ErrorMessage name="email" component="div" className="error" />

							<Field
								type="password"
								name="password"
								label="Password"
								as={TextField}
								inputProps={{
									autoComplete: "current-password",
								}}
							/>
							<ErrorMessage name="email" component="div" className="error" />

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isSubmitting}
								color="info"
								variant="contained"
							>
								Log in
							</Button>
						</Form>
					)}
				</Formik>
			</div>
		</>
	);
}
