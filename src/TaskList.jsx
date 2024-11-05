import {
	Button,
	ButtonGroup,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Drawer,
	IconButton,
	Snackbar,
	Switch,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PinDropIcon from "@mui/icons-material/PinDrop";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useRef, useState } from "react";
import "./styles/task-list.css";
import { copyToClipboard } from "./utils/copyToClipboard";
import CloseButton from "./utils/CloseButton";
import { useClickOutside } from "./utils/useClickOutside";
import { fetchMyODTasks, fetchMyTasks, fetchODTasks } from "./utils/apiQueries";
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
	const [includeMyOD, setIncludeMyOD] = useState(false);
	const [listIsOD, setListIsOD] = useState(false);
	const taskListRef = useRef(null);

	// console.log(user);
	useEffect(() => {
		if (isVisible) {
			const fetchTasks = async () => {
				console.log("gonna fetch some tasks bro");
				var fetchedTasks = await fetchMyTasks({ user, setTasks, setIsLoading });

				console.log("fetched tasks:", fetchedTasks);

				// fetchedTasks.forEach((task) => {
				//  let metadata = getMetadata(task.taskID);
				// setMetadataStore(...prevstore,metadata);
				// });

				setTasks(fetchedTasks);
				setListIsOD(false);
			};

			fetchTasks();
		}
	}, [isVisible, user]);

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

	const handleIncludeMyOD = async () => {
		const newIncludeMyOD = !includeMyOD;
		setIncludeMyOD(newIncludeMyOD);

		if (newIncludeMyOD) {
			setIsLoading(true);
			try {
				const fetchedODTasks = await fetchMyODTasks({ user });
				// set the tasks to include opendata and the previous tasks, if they exist
				setTasks((prevTasks) => {
					if (Array.isArray(prevTasks) && prevTasks.length > 0) {
						return [...prevTasks, ...fetchedODTasks];
					} else {
						return fetchedODTasks;
					}
				});
			} catch (error) {
				console.error("Error fetching open data tasks:", error);
			} finally {
				setIsLoading(false);
			}
		} else {
			// remove open data tasks when toggle is turned off
			setTasks((prevTasks) => {
				if (Array.isArray(prevTasks) && prevTasks.length > 0) {
					return prevTasks.filter(
						(task) => !task.task_id.startsWith("opendata")
					);
				} else {
					return []; // Return an empty array if prevTasks is not valid
				}
			});
		}
	};

	const handleViewOpendata = async () => {
		// TODO: distinguish OD data by user with a tag (based on isOD state)
		setIsLoading(true);
		try {
			const fetchedODTasks = await fetchODTasks({ user });
			setTasks(fetchedODTasks);
			setListIsOD(true);
		} catch (error) {
			console.error("Error fetching open data tasks:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRefresh = async () => {
		setIsLoading(true);
		try {
			const fetchedTasks = await fetchMyTasks({ user, setIsLoading });
			setTasks(fetchedTasks);
			// could make this snazzy and try and check for if the my OD is toggled
		} catch (error) {
			console.error("Error fetching tasks:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleShowOnMap = (task) => {
		console.log(task);
	};

	useClickOutside(taskListRef, () => setIsVisible(false));

	if (!isVisible) return null;
	return (
		<Drawer anchor="right" open={isVisible} className="task-list__drawer">
			<CloseButton setIsVisible={setIsVisible} />
			<div className="task-list__content" ref={taskListRef}>
				<div className="task-list__header">
					<div className="task-list__header__title">
						<h2>My Tasks</h2>
						<IconButton
							onClick={handleRefresh}
							color="secondary"
							className="btn--refresh"
						>
							<RefreshIcon />
						</IconButton>
					</div>
					<div className="task-list__header__od-options">
						<div className="include-my-od">
							<Switch
								checked={includeMyOD}
								onChange={handleIncludeMyOD}
								color="info"
							/>
							<small>include my opendata tasks</small>
						</div>
						<Button
							onClick={handleViewOpendata}
							variant="text"
							size="small"
							color="info"
						>
							View All Opendata Tasks
						</Button>
					</div>
				</div>
				{!isLoading && (
					<div className="task-list__total">Total: {tasks?.length || 0}</div>
				)}
				{isLoading ? (
					<div className="loader">
						<CircularProgress />
					</div>
				) : tasks?.length > 0 ? (
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
							<CardActions className="task-list__card-actions">
								<ButtonGroup size="small" color="info">
									<Button
										variant="contained"
										onClick={() => handleShowOnMap(task)}
										startIcon={<PinDropIcon />}
									>
										Show on Map
									</Button>
									<Button
										variant="outlined"
										color="orange"
										onClick={handleDownload}
										startIcon={<DownloadIcon />}
									>
										Download Data
									</Button>
									<Button
										variant="outlined"
										onClick={() => handleEdit(task)}
										color="secondary"
										endIcon={<EditIcon />}
									>
										Edit Task
									</Button>
								</ButtonGroup>
							</CardActions>
						</Card>
					))
				) : (
					<p className="no-tasks">No tasks to display</p>
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
