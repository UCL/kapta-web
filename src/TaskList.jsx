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
import PushPinIcon from "@mui/icons-material/PushPin";
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
import CloseButton from "./utils/CloseButton";
export default function TaskList({
	isVisible,
	setIsVisible,
	user,
	showTaskForm,
	showNewTaskForm,
	showBounds,
}) {
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [taskListName, setTaskListName] = useState("mine");
	const taskListRef = useRef(null);
	const [isPinned, setIsPinned] = useState(false);

	useEffect(() => {
		if (isVisible) {
			setIsLoading(true);
			const fetchTasks = async () => {
				var fetchedTasks = await fetchMyTasks({ user, setTasks });
				setTasks(fetchedTasks);
				setTaskListName("mine");
				setIsLoading(false);
			};
			setIsLoading(true);
			fetchTasks();
		}
	}, [isVisible, user]);

	useEffect(() => {
		// setIsLoading(true);
		if (taskListName === "opendata") {
			setIsLoading(true);
			const fetchTasks = async () => {
				var fetchedTasks = await fetchODTasks({ user });
				setTasks(fetchedTasks);
			};
			fetchTasks();
		} else if (taskListName === "mine") {
			setIsLoading(true);
			const fetchTasks = async () => {
				var fetchedTasks = await fetchMyTasks({ user });
				setTasks(fetchedTasks);
			};
			fetchTasks();
		}
		setIsLoading(false);
	}, [taskListName, user]);

	const handleCopy = async (text) => {
		const success = await copyToClipboard(text);
		if (success) {
			setSnackbarOpen(true);
		}
	};

	const handleDownload = () => {
		// TODO: get data from s3 or db
		console.log("handle download");
	};

	const handleEdit = (task) => {
		showTaskForm(task);
		setIsVisible(false);
	};

	const handleChangeTaskList = async (event, newTaskListName) => {
		setTaskListName(newTaskListName);
		setIsLoading(true);
	};

	const handleRefresh = async () => {
		setIsLoading(true);
		// todo: also refresh the metadata
		try {
			let fetchedTasks;
			if (taskListName == "mine") {
				fetchedTasks = await fetchMyTasks({ user });
			} else if (taskListName == "opendata") {
				fetchedTasks = await await fetchODTasks({ user });
			}
			setTasks(fetchedTasks);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleShowOnMap = (task) => {
		console.log(task.geo_bounds);
		showBounds(task.geo_bounds);
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
	];

	useClickOutside(taskListRef, () => setIsVisible(false));

	if (!isVisible) return null;
	return (
		<Drawer
			anchor="right"
			open={isVisible}
			className="task-list__drawer"
			variant={isPinned ? "persistent" : "temporary"}
		>
			<div className="task-list__content" ref={!isPinned ? taskListRef : null}>
				{isPinned && <CloseButton setIsVisible={setIsVisible} />}
				<div className="task-list__header">
					<Chip
						onClick={() => setIsPinned(!isPinned)}
						size="small"
						variant={isPinned ? "filled" : "outlined"}
						icon={<PushPinIcon />}
						label={isPinned ? "Unpin" : "Pin"}
					></Chip>
					<ToggleButtonGroup
						color="tomato"
						value={taskListName}
						exclusive
						size="small"
						onChange={handleChangeTaskList}
					>
						<ToggleButton value="mine">My Tasks</ToggleButton>
						<ToggleButton value="opendata">Open Datasets</ToggleButton>
					</ToggleButtonGroup>
					<IconButton
						onClick={handleRefresh}
						color="secondary"
						className="btn--refresh"
					>
						<RefreshIcon />
					</IconButton>
				</div>
				{/* New task button: actually at the bottom */}
				<Tooltip title="Create New Task">
					<Fab
						color="primary"
						variant="extended"
						aria-label="create new task"
						id="task-list__new-form-btn"
						onClick={showNewTaskForm}
					>
						<AddIcon />
						Create New Task
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

										{task.created_by === user.userId && (
											<Button
												variant="outlined"
												color="secondary"
												onClick={() => handleEdit(task)}
												startIcon={<EditIcon />}
											>
												Edit Task
											</Button>
										)}
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
