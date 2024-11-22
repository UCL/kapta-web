import { Drawer, Snackbar } from "@mui/material";
import { useRef, useState } from "react";
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
}) {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState("Code copied to clipboard!");
	const [isPinned, setIsPinned] = useState(false);
	const SearchResultsRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);

	const handleRefresh = async () => {
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

	const handleShowOnMap = (task) => {
		if (task.geo_bounds) {
			setFocusTask(task);
			if (!isPinned) setIsVisible(false);
		} else {
			openSnackbar("No location data available for this task");
		}
	};

	useClickOutside(SearchResultsRef, () => setIsVisible(false));

	const taskCardProps = {
		showTaskOnMap: handleShowOnMap,
		handleCopy: handleCopy,
		user: null,
		handleEdit: null,
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
