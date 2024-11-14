import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, IconButton, TextField } from "@mui/material";
// import * as Yup from "yup";

export default function SearchForm({ isVisible, setIsVisible }) {
	if (!isVisible) return null;

	// formik has built in props regarding submission so we don't need to define them ourselves
	const handleSubmit = async (values) => {
		console.log("Form data:", values);
	};

	return (
		<>
			<Formik onSubmit={handleSubmit}>
				{({ isSubmitting }) => (
					<Form className="form search__form">
						<Field
							type="text"
							name="query"
							label="Search"
							as={TextField}
							fullWidth
						/>
						<ErrorMessage name="query" component="div" className="error" />

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={isSubmitting}
							color="info"
							variant="contained"
						>
							Search
						</Button>
					</Form>
				)}
			</Formik>
		</>
	);
}
