import {
	Button,
	ButtonGroup,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Divider,
	Drawer,
	IconButton,
	Snackbar,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { REQUEST_URL } from "./globals";
import { useEffect, useState } from "react";
import "./styles/task-list.css";
import { copyToClipboard } from "./utils/copyToClipboard";
export default function TaskList({ isVisible, setIsVisible, user }) {
	// TODO: if given user or get user here then get all tasks created by them
	const [tasks, setTasks] = useState([]);
	const [metadataStore, setMetadataStore] = useState([]);
	const [showMetadata, setShowMetadata] = useState(false);
	const [visibleCodes, setVisibleCodes] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	console.log(user);
	useEffect(() => {
		const getMetadata = async () => {
			// TODO: get metadata from dynamodb for task id, maybe combine into other function

			try {
				const response = await fetch(`${REQUEST_URL}/requests`);
				const result = await response.json();
				const metadata = JSON.parse(result);
				console.log(metadata);

				return metadata;
			} catch (error) {
				console.error("Error fetching tasks:", error);
			}
		};
		const fetchTasks = async () => {
			// TODO: get tasks from dynamodb where created_by===userID

			// TODO: get metadata from dynamodb for task id and set in state

			try {
				const response = await fetch(`${REQUEST_URL}/requests`);
				const result = await response.json();
				const fetchedTasks = JSON.parse(result);
				console.log(fetchedTasks);

				// for task in fetchedTasks:
				//     metadata = getMetadata(task.taskID)
				//     metadataStore.append(metadata)

				setTasks(fetchedTasks);
			} catch (error) {
				console.error("Error fetching tasks:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (isVisible) {
			fetchTasks();
		}
	}, [isVisible]);

	const toggleCodeVisibility = (taskId) => {
		setVisibleCodes((prev) => ({
			...prev,
			[taskId]: !prev[taskId],
		}));
	};

	const handleCopy = async (text) => {
		const success = await copyToClipboard(text);
		if (success) {
			setSnackbarOpen(true);
		}
	};

	if (!isVisible) return null;

	return (
		<Drawer anchor="right" open={isVisible} className="task-list__drawer">
			<IconButton
				color="white"
				aria-label="close"
				onClick={() => setIsVisible(false)}
			>
				<HighlightOffIcon />
			</IconButton>
			<div className="task-list__content">
				<h2>My Tasks</h2>
				{isLoading ? (
					<CircularProgress />
				) : (
					tasks.map((task) => (
						<>
							<Card key={task.task_id} className="task-card">
								<CardContent>
									<span className="task-card__title">
										<strong>{task.task_title}</strong>{" "}
										<small>{task.task_id}</small>
									</span>
									<p>{task.task_description}</p>

									{showMetadata && metadataStore.task_id === task.task_id && (
										// get metadata from metadataStore or fetch from dynamodb
										<p>{metadataStore.info}</p>
									)}
									{visibleCodes[task.task_id] && (
										<p
											onClick={() => handleCopy(task.campaign_code)}
											className="campaign-code"
										>
											{task.campaign_code}
										</p>
									)}
								</CardContent>
								<CardActions>
									<ButtonGroup size="small" color="info">
										<Button
											variant="contained"
											onClick={() => setShowMetadata(!showMetadata)}
										>
											View Metadata
										</Button>
										<Button
											variant="outlined"
											onClick={() => toggleCodeVisibility(task.task_id)}
										>
											{visibleCodes[task.task_id]
												? "Hide Campaign Code"
												: "View Campaign Code"}
										</Button>
									</ButtonGroup>
								</CardActions>
							</Card>
							<Divider />
						</>
					))
				)}
			</div>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={snackbarOpen}
				autoHideDuration={2000}
				onClose={() => setSnackbarOpen(false)}
				message="Code copied to clipboard!"
			/>
		</Drawer>
	);
}
