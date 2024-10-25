import {
	Button,
	ButtonGroup,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Drawer,
	Snackbar,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { REQUEST_URL } from "./globals";
import { useEffect, useState } from "react";
import "./styles/task-list.css";
import { copyToClipboard } from "./utils/copyToClipboard";
import CloseButton from "./utils/CloseButton";
export default function TaskList({
	isVisible,
	setIsVisible,
	user,
	showTaskForm,
}) {
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
				setMetadataStore(metadata);

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

				// fetchedTasks.forEach((task) => {
				// 	let metadata = getMetadata(task.taskID);
				// 	metadataStore.append(metadata);
				// });

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
	}, [isVisible, metadataStore]);

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

	const handleDownload = () => {
		// TODO: get data from s3
		console.log("handle download");
	};

	const handleEdit = (task) => {
		console.log(task);
		showTaskForm(task);
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<Drawer anchor="right" open={isVisible} className="task-list__drawer">
			<CloseButton setIsVisible={setIsVisible} />
			<div className="task-list__content">
				<div className="task-list__header">
					<h2>My Tasks</h2>
					{!isLoading && <span>Total: {tasks.length}</span>}
				</div>
				{isLoading ? (
					<CircularProgress />
				) : (
					tasks.map((task) => (
						<Card key={task.task_id} className="task-card">
							<CardContent>
								<span className="task-card__title">
									<strong>{task.task_title}</strong>{" "}
									<small>{task.task_id}</small>
								</span>
								<div className="code-container">
									{visibleCodes[task.task_id] && (
										<span
											onClick={() => handleCopy(task.campaign_code)}
											className="campaign-code"
										>
											{task.campaign_code}
										</span>
									)}
									<Button
										className="show-hide-code-btn"
										color="info"
										variant="outlined"
										onClick={() => toggleCodeVisibility(task.task_id)}
										size="small"
										startIcon={
											visibleCodes[task.task_id] ? (
												<VisibilityOffIcon />
											) : (
												<VisibilityIcon />
											)
										}
									>
										Code
									</Button>
								</div>
								<p>{task.task_description}</p>

								{showMetadata && metadataStore.task_id === task.task_id && (
									// get metadata from metadataStore or fetch from dynamodb
									<p>{metadataStore.info}</p>
								)}
							</CardContent>
							<CardActions>
								<ButtonGroup size="small" color="info">
									<Button
										variant="contained"
										onClick={handleDownload}
										startIcon={<DownloadIcon />}
									>
										Download Data
									</Button>
									<Button variant="outlined" onClick={() => handleEdit(task)}>
										Edit Task
									</Button>
									<Button
										variant="outlined"
										onClick={() => setShowMetadata(!showMetadata)}
									>
										View Metadata
									</Button>
								</ButtonGroup>
							</CardActions>
						</Card>
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
