import { Formik, Form, Field, ErrorMessage } from "formik";
import { Chip, Snackbar } from "@mui/material";
import { fetchAllTasks } from "./utils/apiQueries";
import { useUserStore } from "./globals";
import { useEffect, useState } from "react";
import { Fab, TextField } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

import "./styles/search.css";

export default function SearchForm({ showSearchResults, taskListOpen }) {
	const user = useUserStore();
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [tasks, setTasks] = useState([]);
	const [query, setQuery] = useState("");

	useEffect(() => {
		const fetchTasks = async () => {
			var fetchedTasks = await fetchAllTasks({ user });
			return fetchedTasks;
		};

		fetchTasks().then((tasks) => {
			const visibleTasks = tasks.filter((task) => task.visible === true);
			setTasks(visibleTasks);
		});
	}, [user]);

	const handleSubmit = async (values) => {
		// for the given set of tasks (currently all where visible===true), check in title and then description for the query
		// todo: how do we want to handle plurals? eg elf and elves mentioned
		const q = values.query?.toLowerCase() || values;
		setQuery(q);
		var results = [];

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
	const handleRefresh = async () => {
		try {
			const fetchTasks = async () => {
				var fetchedTasks = await fetchAllTasks({ user });
				return fetchedTasks;
			};

			fetchTasks().then((tasks) => {
				const visibleTasks = tasks.filter((task) => task.visible === true);
				setTasks(visibleTasks);
			});

			handleSubmit(query);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	};

	const chipSuggestions = [
		{
			label: "Show me all the sanity tasks",
			icon: <></>,
			action: (setFieldValue) => {
				setFieldValue("query", "sanity");
				handleSubmit("sanity");
			},
		},
		{
			label: "Display all tasks mentioning 'points'",
			icon: <></>,
			action: (setFieldValue) => {
				setFieldValue("query", "points");
				handleSubmit("points");
			},
		},
		{
			label: "Where are the elves?",
			icon: <></>,
			action: (setFieldValue) => {
				setFieldValue("query", "elf");
				handleSubmit("elf");
			},
		},
	];

	return (
		<>
			<Formik onSubmit={handleSubmit} initialValues={{ query: "" }}>
				{({ isSubmitting, setFieldValue }) => (
					<Form
						className={`form search__form ${taskListOpen ? "splitscreen" : ""}`}
					>
						<Snackbar
							anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
							className="no-tasks"
							open={snackbarOpen}
							autoHideDuration={4000}
							onClose={() => setSnackbarOpen(false)}
							message="No tasks matching search query"
						/>
						<div className="search__suggestions">
							{chipSuggestions.map((key, index) => (
								<Chip
									key={index}
									label={key.label}
									icon={key.icon}
									onClick={() => key.action(setFieldValue)}
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
