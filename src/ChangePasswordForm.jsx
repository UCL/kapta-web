import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import "./styles/forms.css";
import { respondToPasswordChangeChallenge } from "./utils/auth";
import { checkPasswordStrength } from "./utils/generalUtils";
import { useUserStore } from "./globals";
import { CloseButton } from "./utils/Buttons";
import * as Yup from "yup";
import PasswordChecker from "./utils/PasswordChecker";

export default function ChangePasswordForm({
	isVisible,
	setIsVisible,
	showLoginSuccessModal,
	showFilledLoginForm,
	prefilledEmail,
	loginSession,
}) {
	const user = useUserStore();
	useTheme();
	const [passwordStrength, setPasswordStrength] = useState({});

	if (!isVisible) return null;

	const initialValues = {
		email: prefilledEmail || "",
	};

	const validationSchema = Yup.object().shape({
		email: Yup.string().email("Invalid email address").required("Required"),
		oldPassword: Yup.string().required("Required"),
		password: Yup.string()
			.test(
				"password-strength",
				"Password does not meet requirements",
				function (value) {
					if (!value) return false;
					return checkPasswordStrength(value);
				}
			)
			.required("Required"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password"), null], "Passwords must match")
			.required("Required"),
		// todo: confirm pw doesn't seem to work when not matching
	});

	const setUserDetailsAndShowModal = async (response) => {
		// this doesn't work sometimes?
		const details = await user.setUserDetails(response);
		showLoginSuccessModal(`Welcome back, ${details.dName}`);
		setIsVisible(false);
	};

	const handleSubmit = async (values) => {
		console.log("Handling submit", values);
		return respondToPasswordChangeChallenge(loginSession, values).then(
			({ response }) => {
				if (!response) {
					console.error("Error signing up");
				}
				if (response === 4469) {
					showFilledLoginForm(values.email);
				} else {
					setUserDetailsAndShowModal(response.AuthenticationResult);
				}
			}
		);
	};

	const handlePasswordChange = (e, setFieldValue) => {
		const newPassword = e.target.value;
		setFieldValue("password", newPassword);
		setPasswordStrength(checkPasswordStrength(newPassword));
	};

	return (
		<>
			<div className="signup__form--container">
				<CloseButton setIsVisible={setIsVisible} />
				<Formik
					onSubmit={handleSubmit}
					initialValues={initialValues}
					validationSchena={validationSchema}
				>
					{({ isSubmitting, setFieldValue }) => (
						<Form className="form signup__form" autoComplete="on">
							<Typography variant="h4" color="primary">
								Please change your password
							</Typography>

							<Field
								type="email"
								name="email"
								label="Email Address"
								as={TextField}
								required
								inputProps={{
									autoComplete: "new-email",
								}}
								autoComplete="new-email"
							/>
							<ErrorMessage name="email" component="div" className="error" />

							<Field
								type="password"
								name="oldPassword"
								label="Old Password"
								as={TextField}
								required
								inputProps={{
									autoComplete: "old-password",
								}}
								autoComplete="old-password"
							/>
							<ErrorMessage name="password" component="div" className="error" />

							<Field
								type="password"
								name="password"
								label="New Password"
								as={TextField}
								required
								inputProps={{
									autoComplete: "new-password",
								}}
								autoComplete="new-password"
								onChange={(e) => handlePasswordChange(e, setFieldValue)}
							/>
							<ErrorMessage name="password" component="div" className="error" />

							<Field
								type="password"
								name="confirmPassword"
								label="Confirm New Password"
								as={TextField}
								required
							/>
							<ErrorMessage
								name="confirmPassword"
								component="div"
								className="error"
							/>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isSubmitting}
								color="primary"
								variant="contained"
							>
								Sign Up
							</Button>
						</Form>
					)}
				</Formik>
				<PasswordChecker passwordStrength={passwordStrength} />
			</div>
		</>
	);
}
