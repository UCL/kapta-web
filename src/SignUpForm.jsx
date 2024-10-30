import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import SuccessModal from "./SuccessModal";
import "./styles/forms.css";
import { initiateAuth } from "./utils/auth";
import { useUserStore } from "./globals";
import CloseButton from "./utils/CloseButton";
// import * as Yup from "yup";

export default function SignUpForm({ isVisible, setIsVisible }) {
	const [successModalVisible, setSuccessModalVisible] = useState(false);
	const user = useUserStore();
	useTheme();

	if (!isVisible) return null;

	// formik has built in props regarding submission so we don't need to define them ourselves
	const handleSubmit = async (values) => {
		console.log("Form data:", values);
		const { email, password } = values;

		return initiateAuth(email, password).then(({ response }) => {
			if (!response) {
				alert("Incorrect email or password");
				// TODO: show sign up
			} else {
				user.setUserDetails(response);
				setSuccessModalVisible(true);
			}
		});
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
			<div className="signup__form--container">
				<CloseButton setIsVisible={setIsVisible} />
				<Formik onSubmit={handleSubmit}>
					{({ isSubmitting }) => (
						<Form className="form signup__form">
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
							</div>
							<Field
								type="email"
								name="email"
								label="Email Address"
								as={TextField}
								required
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
								required
								inputProps={{
									autoComplete: "current-password",
								}}
							/>
							<ErrorMessage name="email" component="div" className="error" />

							<div className="form__row">
								<Field
									type="phone"
									name="phoneNumber"
									label="Phone Number (optional)"
									as={TextField}
								/>
								<ErrorMessage
									name="phoneNumber"
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

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isSubmitting}
								color="info"
								variant="contained"
							>
								Sign Up
							</Button>
						</Form>
					)}
				</Formik>
			</div>
		</>
	);
}
