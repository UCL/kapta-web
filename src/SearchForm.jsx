import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Snackbar, TextField } from "@mui/material";
import { fetchODTasks } from "./utils/apiQueries";
import { useUserStore } from "./globals";
import { useState } from "react";

import "./styles/search.css";

export default function SearchForm({ isVisible, showSearchResults }) {
	const user = useUserStore();
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	if (!isVisible) return null;

	const handleSubmit = async (values) => {
		// for the given set of tasks (currently all od), check in title and then description for the query
		const q = values.query;
		var results = [];

		const fetchedODTasks = await fetchODTasks({ user });

		fetchedODTasks.forEach((task) => {
			if (
				task.task_title.toLowerCase().includes(q.toLowerCase()) ||
				task.task_description.toLowerCase().includes(q.toLowerCase())
			) {
				results.push(task);
				// todo: show a task list with the results?
			}
		});
		if (results.length === 0) {
			setSnackbarOpen(true);
		} else showSearchResults(results);
	};

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: "middle", horizontal: "center" }}
				className="no-tasks"
				open={snackbarOpen}
				autoHideDuration={4000}
				onClose={() => setSnackbarOpen(false)}
				message="No tasks matching search query"
			/>
			<Formik onSubmit={handleSubmit} initialValues={{ query: "" }}>
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
