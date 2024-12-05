import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField, Typography, useTheme } from "@mui/material";
import DangerousIcon from "@mui/icons-material/Dangerous";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import "./styles/forms.css";
import { signUp } from "./utils/auth";
import PasswordStrengthContainer from "./utils/PasswordStrengthContainer";
import { checkPasswordStrength } from "./utils/generalUtils";
import { CloseButton } from "./utils/Buttons";
import * as Yup from "yup";


export default function SignUpForm({
	isVisible,
	setIsVisible,
	showConfirmModal,
	showFilledLoginForm,
}) {
	useTheme();
	const [passwordStrength, setPasswordStrength] = useState({});

	if (!isVisible) return null;

	const initialValues = {
		givenName: "",
		familyName: "",
		email: "",
		password: "",
		preferredUsername: "",
		phoneNumber: "",
		confirmPassword: "",
		organisation: "",
	};

	const validationSchema = Yup.object({
		givenName: Yup.string().required("Required"),
		familyName: Yup.string().required("Required"),
		email: Yup.string().email("Invalid email address").required("Required"),
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
	const handleSubmit = async (values) => {
		if (values.phoneNumber) {
			// make sure the phone number has a +
			const formattedPhoneNumber = values.phoneNumber.startsWith("+")
				? values.phoneNumber
				: `+${values.phoneNumber}`;
			values.phoneNumber = formattedPhoneNumber;
		}

		return signUp(values).then(({ response }) => {
			if (!response) {
				console.error("Error signing up");
			}
			if (response === 4469) {
				showFilledLoginForm(values.email);
			} else {
				showConfirmModal(values.email);
				setIsVisible(false);
			}
		});
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
					validationSchema={validationSchema}
				>
					{({ isSubmitting, setFieldValue }) => (
						<Form className="form signup__form" autoComplete="on">
							<Typography variant="h4" color="primary">
								Create Account
							</Typography>
							<div className="form__row">
								<Field
									type="text"
									name="givenName"
									label="First Name"
									as={TextField}
									required
								/>
								<ErrorMessage
									name="givenName"
									component="div"
									className="error"
								/>
								<Field
									type="text"
									name="familyName"
									label="Last Name"
									as={TextField}
									required
								/>
								<ErrorMessage
									name="familyName"
									component="div"
									className="error"
								/>
								<Field
									type="text"
									name="preferredUsername"
									label="Display Name (optional)"
									as={TextField}
								/>
								<ErrorMessage
									name="preferredUsername"
									component="div"
									className="error"
								/>
							</div>
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
								name="password"
								label="Password"
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
								label="Confirm Password"
								as={TextField}
								required
							/>
							<ErrorMessage
								name="confirmPassword"
								component="div"
								className="error"
							/>

							<div className="form__row">
								<Field
									type="phone"
									name="phoneNumber"
									label="Phone Number (optional)"
									as={TextField}
									helperText="Please include your country code"
								/>
								<ErrorMessage
									name="phoneNumber"
									component="div"
									className="error"
								/>
								<Field
									type="text"
									name="organisation"
									label="Organisation (optional)"
									as={TextField}
									helperText=" "
								/>
								<ErrorMessage
									name="organisation"
									component="div"
									className="error"
								/>
							</div>

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
				<PasswordStrengthContainer passwordStrength={passwordStrength} />
			</div>
		</>
	);
}
