import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Snackbar, TextField } from "@mui/material";
import { fetchAllTasks, fetchODTasks } from "./utils/apiQueries";
import { useUserStore } from "./globals";
import { useEffect, useState } from "react";

import "./styles/search.css";

export default function SearchForm({ isVisible, showSearchResults }) {
	const user = useUserStore();
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [tasks, setTasks] = useState([]);
	const [listIsOD, setListIsOD] = useState(true);

	useEffect(() => {
		if (isVisible) {
			const fetchTasks = async () => {
				var fetchedTasks = await fetchAllTasks({ user });
				return fetchedTasks;
			};

			fetchTasks().then((tasks) => {
				const visibleTasks = tasks.filter((task) => task.visible === true);
				setTasks(visibleTasks);
			});
		}
	}, [isVisible, user]);

	if (!isVisible) return null;

	const handleSubmit = async (values) => {
		// for the given set of tasks (currently all where visible===true), check in title and then description for the query
		const q = values.query;
		var results = [];

		const fetchedODTasks = await fetchODTasks({ user });

		fetchedODTasks.forEach((task) => {
			if (
				task.task_title.toLowerCase().includes(q.toLowerCase()) ||
				task.task_description.toLowerCase().includes(q.toLowerCase())
			) {
				results.push(task);
			}
		});
		if (results.length === 0) {
			setSnackbarOpen(true);
		} else showSearchResults(results);
	};

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
