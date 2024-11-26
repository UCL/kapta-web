import {
	CircularProgress,
	Drawer,
	Fab,
	IconButton,
	Snackbar,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useRef, useState } from "react";
import "./styles/task-list.css";
import { copyToClipboard } from "./utils/copyToClipboard";
import { useClickOutside } from "./utils/useClickOutside";
import { fetchMyTasks, fetchODTasks } from "./utils/apiQueries";
import { DrawerCloseButton, PinButton } from "./utils/Buttons";
import TaskCard from "./utils/TaskCard";
export default function TaskList({
	isVisible,
	setIsVisible,
	user,
	showTaskForm,
	showNewTaskForm,
	showBounds,
	setFocusTask,
	chosenTask,
}) {
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState("Code copied to clipboard!");

	const [taskListName, setTaskListName] = useState("mine");
	const taskListRef = useRef(null);
	const taskRefs = useRef({});
	const [isPinned, setIsPinned] = useState(false);
	const [displayedTask, setDisplayedTask] = useState(null);

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

	useEffect(() => {
		if (chosenTask && chosenTask.includes("opendata")) {
			setTaskListName("opendata");
		}
		if (chosenTask && taskRefs.current[chosenTask]) {
			console.log("chosentask", chosenTask);

			// Scroll to the chosen task
			taskRefs.current[chosenTask].scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			// Make it flash
			const taskElement = taskRefs.current[chosenTask];
			taskElement.classList.add("flash");

			// Remove the flash class after the animation duration
			setTimeout(() => {
				taskElement.classList.remove("flash");
			}, 1600);
		}
	});

	const openSnackbar = (msg) => {
		setSnackbarOpen(true);
		setSnackbarMsg(msg);
	};

	const handleCopy = async (text) => {
		const success = await copyToClipboard(text);
		if (success) {
			openSnackbar("Code copied to clipboard!");
		}
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

	useClickOutside(taskListRef, () => setIsVisible(false));

	const taskCardProps = {
		handleCopy: handleCopy,
		user: user,
		handleEdit: handleEdit,
		displayedTask: displayedTask,
		setDisplayedTask: setDisplayedTask,
		setFocusTask: setFocusTask,
		openSnackbar: openSnackbar,
		isPinned: isPinned,
		setIsVisible: setIsVisible,
		showBounds: showBounds,
		taskRefs: taskRefs,
	};

	if (!isVisible) return null;
	return (
		<Drawer
			anchor="right"
			open={isVisible}
			className="task-list__drawer"
			variant={isPinned ? "persistent" : "temporary"}
		>
			{isPinned && <DrawerCloseButton setIsVisible={setIsVisible} />}
			<div className="task-list__content" ref={!isPinned ? taskListRef : null}>
				<div className="task-list__header">
					<PinButton isPinned={isPinned} setIsPinned={setIsPinned} />

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
						<TaskCard key={task.task_id} task={task} {...taskCardProps} />
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
				message={snackbarMsg}
			/>
		</Drawer>
	);
}
