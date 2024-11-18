import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Fab, IconButton, TextField } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
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
							label="Search WhatsApp maps ground data"
							as={TextField}
							fullWidth
							className="search__form__input"
						/>
						<ErrorMessage name="query" component="div" className="error" />

						{/* Submit Button */}
						<Fab
							type="submit"
							disabled={isSubmitting}
							color="info"
							variant="contained"
							className="search__submit__btn"
						>
							<ArrowUpwardRoundedIcon />
						</Fab>
					</Form>
				)}
			</Formik>
		</>
	);
}
