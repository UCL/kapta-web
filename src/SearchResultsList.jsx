import { Drawer, Snackbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./styles/task-list.css";
import { copyToClipboard } from "./utils/copyToClipboard";
import { useClickOutside } from "./utils/useClickOutside";
import TaskCard from "./utils/TaskCard";
import { DrawerCloseButton, PinButton } from "./utils/Buttons";
export default function SearchResults({
	isVisible,
	setIsVisible,
	results,
	setFocusTask,
	chosenTask,
}) {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState("Code copied to clipboard!");
	const [isPinned, setIsPinned] = useState(false);
	const SearchResultsRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);
	const [displayedTask, setDisplayedTask] = useState(null);
	const taskRefs = useRef({});

	useEffect(() => {
		if (chosenTask && taskRefs.current[chosenTask]) {
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

	const handleRefresh = async () => {
		// todo: refresh the results
		setIsLoading(true);
		try {
			// let newResults = await refreshSearchResult();
		} catch (error) {
			console.error("Error fetching tasks:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopy = async (text) => {
		const success = await copyToClipboard(text);
		if (success) {
			openSnackbar("Code copied to clipboard!");
		}
	};

	const openSnackbar = (msg) => {
		setSnackbarOpen(true);
		setSnackbarMsg(msg);
	};

	useClickOutside(SearchResultsRef, () => setIsVisible(false));

	const taskCardProps = {
		handleCopy: handleCopy,
		user: null,
		handleEdit: null,
		displayedTask: displayedTask,
		setDisplayedTask: setDisplayedTask,
		setFocusTask: setFocusTask,
		openSnackbar: openSnackbar,
		isPinned: isPinned,
		setIsVisible: setIsVisible,
		showBounds: null,
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
			<div
				className="task-list__content"
				ref={!isPinned ? SearchResultsRef : null}
			>
				<div className="task-list__header">
					<PinButton isPinned={isPinned} setIsPinned={setIsPinned} />
					Search Results
				</div>
				<div className="task-list__total">Total: {results.length || 0}</div>
				{results.map((task) => (
					<TaskCard key={task.task_id} task={task} {...taskCardProps} />
				))}
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
