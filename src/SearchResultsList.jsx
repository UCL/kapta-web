import { CircularProgress, Drawer, Snackbar } from "@mui/material";
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
	chosenTaskId,
	scrollFlashTask,
}) {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState("Code copied to clipboard!");
	const [isPinned, setIsPinned] = useState(false);
	const SearchResultsRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [displayedTask, setDisplayedTask] = useState(null);
	const taskRefs = useRef({});

	useEffect(() => {
		if (chosenTaskId && taskRefs.current[chosenTaskId]) {
			scrollFlashTask(taskRefs);
		}
	});

	// useEffect(() => {
	// 	// set pinned preference when component mounts
	// 	const storedPinnedPreference = localStorage.getItem(
	// 		"resultsPinnedPreference"
	// 	);
	// 	if (storedPinnedPreference) {
	// 		setIsPinned(...storedPinnedPreference);
	// 	}
	// }, []);

	// Store pinned task in localStorage whenever it changes
	useEffect(() => {
		if (isPinned !== undefined) {
			localStorage.setItem("resultsPinnedPreference", isPinned);
			console.log(localStorage.getItem("resultsPinnedPreference"));
		}
	}, [isPinned]);

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
				{!isLoading && (
					<div className="task-list__total">Total: {results?.length || 0}</div>
				)}
				{isLoading ? (
					<div className="loader">
						<CircularProgress />
					</div>
				) : (
					results.map((task) => (
						<TaskCard key={task.task_id} task={task} {...taskCardProps} />
					))
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
