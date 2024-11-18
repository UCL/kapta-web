import {
	Box,
	Button,
	ButtonGroup,
	Card,
	CardActions,
	CardContent,
	Chip,
	CircularProgress,
	Drawer,
	Fab,
	IconButton,
	Snackbar,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PlaceIcon from "@mui/icons-material/Place";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useRef, useState } from "react";
import "./styles/task-list.css";
import { copyToClipboard } from "./utils/copyToClipboard";
import { useClickOutside } from "./utils/useClickOutside";
import { fetchMyTasks, fetchODTasks } from "./utils/apiQueries";
export default function TaskList({
	isVisible,
	setIsVisible,
	user,
	showTaskForm,
	showNewTaskForm,
}) {
	// TODO: if given user or get user here then get all tasks created by them
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [listIsOD, setListIsOD] = useState(false);
	const [taskListName, setTaskListName] = useState("my-tasks");
	const taskListRef = useRef(null);

	useEffect(() => {
		if (isVisible) {
			const fetchTasks = async () => {
				var fetchedTasks = await fetchMyTasks({ user, setTasks, setIsLoading });
				setTasks(fetchedTasks);
				setTaskListName("my-tasks");
			};

			fetchTasks();
		}
	}, [isVisible, user]);

	useEffect(() => {
		setIsLoading(true);
		if (taskListName === "opendata") {
			const fetchTasks = async () => {
				var fetchedTasks = await fetchODTasks({ user });
				setTasks(fetchedTasks);
			}
			fetchTasks();
		} else if (taskListName === "my-tasks") {
			const fetchTasks = async () => {
				var fetchedTasks = await fetchMyTasks({ user });
				setTasks(fetchedTasks);
			}
			fetchTasks();
		}
		setIsLoading(false);
	}, [taskListName]);

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

	const handleChangeTaskList = async (
		event,
		newTaskListName,
	) => {
		setTaskListName(newTaskListName);
	};

	const handleRefresh = async () => {
		setIsLoading(true);
		// todo: also refresh the metadata
		try {
			let fetchedTasks;
			if (taskListName == "my-tasks") {
				fetchedTasks = await fetchMyTasks({ user, setIsLoading });
			} else if (taskListName == "opendata") {
				fetchedTasks = await await fetchODTasks({ user });
			}
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

	const cardActionBtns = [
		{
			text: "Show on Map",
			icon: <PinDropIcon />,
			action: (task) => () => handleShowOnMap(task),
			variant: "contained",
		},
		{
			text: "Download Data",
			icon: <DownloadIcon />,
			action: (task) => () => handleDownload(task),
			variant: "outlined",
			color: "orange",
		},
		{
			text: "Edit Task",
			icon: <EditIcon />,
			action: (task) => () => handleEdit(task),
			variant: "outlined",
			color: "secondary",
		},
	];

	useClickOutside(taskListRef, () => setIsVisible(false));

	if (!isVisible) return null;
	return (
		<Drawer anchor="right" open={isVisible} className="task-list__drawer">
			<div className="task-list__content" ref={taskListRef}>
				<div className="task-list__header">
					<ToggleButtonGroup
						color="primary"
						value={taskListName}
						exclusive
						onChange={handleChangeTaskList}
					>
						<ToggleButton
							value="my-tasks"
						>
							My Tasks
						</ToggleButton>
						<ToggleButton
							value="opendata"
						>
							Open Datasets
						</ToggleButton>
					</ToggleButtonGroup>
					<IconButton
						onClick={handleRefresh}
						color="secondary"
						className="btn--refresh"
					>
						<RefreshIcon />
					</IconButton>
				</div>
				<Tooltip title="Create New Task">
					<Fab
						color="primary"
						aria-label="create new task"
						id="task-list__new-form-btn"
						onClick={showNewTaskForm}
					>
						<AddIcon />
					</Fab>
				</Tooltip>

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
							<Box
								className={`task-card__status-strip ${
									task.status?.toLowerCase() || "active"
								}`}
							>
								<span>{task.status || "Active"}</span>
							</Box>
							<Box className="task-list__card-content__wrapper">
								<CardContent>
									<span className="task-card__title">
										<Typography variant="h5">{task.task_title}</Typography>
										<span className="task-card__info">
											<Tooltip title="Number of uploaders">
												<Chip
													className="task__info-chip"
													variant="outlined"
													size="small"
													label={task.num_uploaders || 0}
													icon={<PersonIcon size="small" />}
												></Chip>
											</Tooltip>
											<Tooltip title="Total number of observations">
												<Chip
													className="task__info-chip"
													variant="outlined"
													size="small"
													label={task.sum_observations || 0}
													max={999}
													icon={<PlaceIcon size="small" />}
												></Chip>
											</Tooltip>

											<Tooltip title="Campaign code">
												<Chip
													onClick={() => handleCopy(task.campaign_code)}
													className="campaign-code"
													variant="outlined"
													label={task.campaign_code}
													size="small"
												></Chip>
											</Tooltip>
										</span>
									</span>
									<p>{task.task_description}</p>
								</CardContent>
								<CardActions className="task-list__card-actions">
									<ButtonGroup size="small" color="info">
										{cardActionBtns.map((btn, index) => (
											<Button
												key={index}
												variant={btn.variant}
												color={btn.color}
												onClick={btn.action(task)}
												startIcon={btn.icon}
											>
												{btn.text}
											</Button>
										))}
									</ButtonGroup>
								</CardActions>
							</Box>
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
