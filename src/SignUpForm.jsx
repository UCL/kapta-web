import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, IconButton, TextField, useTheme } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useState } from "react";
import SuccessModal from "./SuccessModal";
import "./styles/forms.css";
import { initiateAuth } from "./utils/auth";
import { useUserStore } from "./globals";
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
			<IconButton
				color="white"
				aria-label="cancel"
				onClick={() => setIsVisible(false)}
			>
				<HighlightOffIcon />
			</IconButton>
			<Formik onSubmit={handleSubmit}>
				{({ isSubmitting }) => (
					<Form className="form login__form">
						<Field
							type="email"
							name="email"
							label="Email Address"
							as={TextField}
						/>
						<ErrorMessage name="email" component="div" className="error" />

						<Field
							type="password"
							name="password"
							label="Password"
							as={TextField}
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
		</>
	);
}
