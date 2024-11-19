import { Drawer, Snackbar } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PinDropIcon from "@mui/icons-material/PinDrop";
import { useRef, useState } from "react";
import "./styles/task-list.css";
import { copyToClipboard } from "./utils/copyToClipboard";
import { useClickOutside } from "./utils/useClickOutside";
import TaskCard from "./utils/TaskCard";
import { CloseButton, PinButton } from "./utils/Buttons";
export default function SearchResults({
	isVisible,
	setIsVisible,
	results,
	setFocusTask,
}) {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState("Code copied to clipboard!");
	const [listIsOD, setListIsOD] = useState(true); // list should be OD by default, use a tag to show if it belogs to the user
	const [isPinned, setIsPinned] = useState(false);
	const SearchResultsRef = useRef(null);

	const handleCopy = async (text) => {
		const success = await copyToClipboard(text);
		if (success) {
			openSnackbar("Code copied to clipboard!");
		}
	};

	const handleDownload = () => {
		// TODO: get data from rds
		console.log("handle download");
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

	useClickOutside(SearchResultsRef, () => setIsVisible(false));

	const taskCardProps = {
		cardActionBtns: cardActionBtns,
		handleCopy: handleCopy,
		userID: null,
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
			<div
				className="task-list__content"
				ref={!isPinned ? SearchResultsRef : null}
			>
				{isPinned && <CloseButton setIsVisible={setIsVisible} />}
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
