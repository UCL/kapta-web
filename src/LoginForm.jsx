import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField, Typography, useTheme } from "@mui/material";
import "./styles/forms.css";
import { initiateAuth } from "./utils/auth";
import { useUserStore } from "./globals";
import CloseButton from "./utils/CloseButton";
// import * as Yup from "yup";

export default function LoginForm({
	isVisible,
	setIsVisible,
	setSignUpVisible,
	setErrorMsg,
	showConfirmModal,
	showLoginSuccessModal,
	prefilledEmail,
}) {
	const user = useUserStore();
	// useTheme();
	if (!isVisible) return null;

	const setUserDetailsAndShowModal = async (response) => {
		// this doesn't work sometimes?
		const details = await user.setUserDetails(response);
		showLoginSuccessModal(`Welcome back, ${details.dName}`);
		setIsVisible(false);
	};
	const handleSubmit = async (values) => {
		const { email, password } = values;

		return initiateAuth(email, password).then(({ response }) => {
			if (response === 4359) {
				setIsVisible(false);
				setSignUpVisible(true);
				setErrorMsg("User details not found, please sign up");
			} else if (response === 4399) {
				setErrorMsg("Please confirm your account before logging in");
				showConfirmModal(email);
			} else {
				setUserDetailsAndShowModal(response);
			}
		});
	};
	const initialValues = {
		email: prefilledEmail || "",
		password: "",
	};
	return (
		<>
			<div className="login__form--container">
				<CloseButton setIsVisible={setIsVisible} />
				<Formik onSubmit={handleSubmit} initialValues={initialValues}>
					{({ isSubmitting }) => (
						<Form className="form login__form">
							<Typography variant="h4" color="orange">
								Log in
							</Typography>
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
