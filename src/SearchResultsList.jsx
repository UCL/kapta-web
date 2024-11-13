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
	Snackbar,
	Tooltip,
	Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PlaceIcon from "@mui/icons-material/Place";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useRef, useState } from "react";
import "./styles/task-list.css";
import { copyToClipboard } from "./utils/copyToClipboard";
import { useClickOutside } from "./utils/useClickOutside";
export default function SearchResults({ isVisible, setIsVisible, results }) {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [listIsOD, setListIsOD] = useState(true); // list should be OD by default, use a tag to show if it belogs to the user
	const SearchResultsRef = useRef(null);

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

	const handleShowOnMap = (task) => {
		console.log(task);
		// we will probably show them all on the map so this will be about flying to the right one
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

	if (!isVisible) return null;

	console.log("search results list received:", results);
	return (
		<Drawer anchor="right" open={isVisible} className="task-list__drawer">
			<div className="task-list__content" ref={SearchResultsRef}>
				<div className="task-list__header">
					<h2>Search Results</h2>
				</div>
				<div className="task-list__total">Total: {results.length || 0}</div>
				{results.map((task) => (
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

										{!task.private && (
											<Tooltip title="Campaign code">
												<Chip
													onClick={() => handleCopy(task.campaign_code)}
													className="campaign-code"
													variant="outlined"
													label={task.campaign_code}
													size="small"
												></Chip>
											</Tooltip>
										)}
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
				))}
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
