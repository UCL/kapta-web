import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Chip, Snackbar } from "@mui/material";
import { fetchAllTasks, fetchODTasks } from "./utils/apiQueries";
import { useUserStore } from "./globals";
import { useEffect, useState } from "react";
import { Fab, TextField } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

import "./styles/search.css";

export default function SearchForm({
	isVisible,
	showSearchResults,
	taskListOpen,
}) {
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

	// import * as Yup from "yup";

	if (!isVisible) return null;

	const handleSubmit = async (values) => {
		// for the given set of tasks (currently all where visible===true), check in title and then description for the query
		// todo: how do we want to handle plurals? eg elf and elves mentioned
		const q = values.query?.toLowerCase() || values;
		var results = [];
		console.log(tasks.length);

		tasks.forEach((task) => {
			if (
				task.task_title.toLowerCase().includes(q) ||
				task.task_description.toLowerCase().includes(q)
			) {
				results.push(task);
			}
		});
		if (results.length === 0) {
			setSnackbarOpen(true);
		} else showSearchResults(results);
	};

	const chipSuggestions = [
		{
			label: "Show me all the sanity tasks",
			icon: <></>,
			action: () => handleSubmit("sanity"),
		},
		{
			label: "Display all tasks points",
			icon: <></>,
			action: () => handleSubmit("points"),
		},
		{
			label: "Where are the elves?",
			icon: <></>,
			action: () => handleSubmit("elf"),
		},
	];

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
					<Form
						className={`form search__form ${taskListOpen ? "splitscreen" : ""}`}
					>
						<div className="search__suggestions">
							{chipSuggestions.map((key, index) => (
								<Chip
									key={index}
									label={key.label}
									icon={key.icon}
									onClick={key.action}
									variant="outlined"
									color="muted"
									size="small"
								/>
							))}
						</div>
						<div className="search__input__wrapper">
							<Field
								type="text"
								name="query"
								label="Search WhatsApp maps ground data"
								as={TextField}
								className="search__input"
								// fullWidth
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
								<ArrowUpwardRoundedIcon fontSize="large" />
							</Fab>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}

export function MainSearchForm({ isVisible, showSearchResults }) {}
