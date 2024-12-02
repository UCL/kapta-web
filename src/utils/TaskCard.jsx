import {
	Box,
	Button,
	ButtonGroup,
	Card,
	CardActions,
	CardContent,
	Chip,
	Tooltip,
	Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PinDropIcon from "@mui/icons-material/PinDrop";
import LoadingButton from "@mui/lab/LoadingButton";
import PlaceIcon from "@mui/icons-material/Place";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { getDataFromBucket } from "./apiQueries";
import { useState } from "react";
import JSZip from "jszip";
import { slugify } from "./generalUtils";

export default function TaskCard({
	task,
	handleCopy,
	user,
	handleEdit,
	displayedTask,
	setDisplayedTask,
	setFocusTask,
	openSnackbar,
	isPinned,
	setIsVisible,
	showBounds,
	taskRefs,
}) {
	const userID = user?.userId || null;
	const taskId = task.task_id;
	const [isLoading, setIsLoading] = useState(false);

	// dynamically set campaign code visibility
	let codeVisible = false;
	if (task.created_by === userID) {
		codeVisible = true;
	} else if (!task.private) {
		codeVisible = true;
	}

	const handleDownload = async (task) => {
		setIsLoading({ download: true });

		const data = await getDataFromBucket({ user, task });

		if (data.response !== 200) {
			// todo: show an error
			console.error("Error downloading task data", data);
			return;
		} else {
			const txtContent = data.content.txtFileContent;
			const jsonContent = data.content.jsonFileContent;

			const zip = new JSZip();
			const downloadTitle = slugify(task.task_title);

			zip.file(`${downloadTitle}-${task.campaign_code}.txt`, txtContent);
			zip.file(`${downloadTitle}-${task.campaign_code}.geojson`, jsonContent);

			setIsLoading({ download: false });

			const zipBlob = await zip.generateAsync({ type: "blob" });
			const zipUrl = URL.createObjectURL(zipBlob);
			const zipLink = document.createElement("a");
			zipLink.href = zipUrl;
			zipLink.download = `${taskId}.zip`;
			document.body.appendChild(zipLink);
			zipLink.click();
			document.body.removeChild(zipLink);
			URL.revokeObjectURL(zipUrl);
		}
	};

	const handleShowOnMap = (task) => {
		if (task.geo_bounds) {
			if (showBounds) showBounds(task);
			else setFocusTask(task);
			if (!isPinned) setIsVisible(false);
		} else {
			// shouldn't trigger since btn should be disabled
			openSnackbar("No location data available for this task");
		}
	};

	const showDataPoints = async (task) => {
		setFocusTask(null);
		setIsLoading({ points: true });
		const data = await getDataFromBucket({ user, task });
		if (data.content.jsonFileContent) {
			const geojson = data.content.jsonFileContent;
			const featureCollection = JSON.parse(geojson);
			setFocusTask(featureCollection);
			setIsLoading({ points: false });
		} else {
			openSnackbar("No location data available for this task");
		}
	};

	const cardActionBtns = [
		{
			text:
				taskId === displayedTask?.task_id && userID === task.created_by
					? "Show data points"
					: "Show on Map",
			icon: <PinDropIcon />,
			action:
				taskId === displayedTask?.task_id && userID === task.created_by
					? (task) => showDataPoints(task)
					: (task) => {
							handleShowOnMap(task);
							setDisplayedTask(task);
					  },
			variant: "contained",
			loading: taskId === displayedTask?.task_id,
			disabled: !task.geo_bounds,
			typeName: "points",
		},

		{
			text: userID === task.created_by ? "Download Data" : "Request Data",
			icon: <DownloadIcon />,
			action: (task) => handleDownload(task),
			variant: "outlined",
			color: "orange",
			loading: true,
			typeName: "download",
			disabled: userID !== task.created_by,
		},
	];

	// todo: if task list is od use a tag to show if it belogs to the user, if org===opendata? may want to do this on the parent level
	return (
		<Card
			className="task-card"
			ref={(el) => (taskRefs.current[task.task_id] = el)}
		>
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
							{codeVisible && (
								<Tooltip title="Campaign code">
									<Chip
										onClick={() => {
											handleCopy(task.campaign_code);
										}}
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
						{cardActionBtns.map((btn, index) =>
							btn.loading === true ? (
								<LoadingButton
									key={index}
									variant={btn.variant}
									loading={isLoading[btn.typeName]}
									loadingPosition="start"
									color={btn.color}
									startIcon={btn.icon}
									onClick={() => btn.action(task)}
									disabled={btn.disabled}
								>
									{btn.text}
								</LoadingButton>
							) : (
								<Button
									key={index}
									variant={btn.variant}
									color={btn.color}
									onClick={() => btn.action(task)} // Pass as a function
									startIcon={btn.icon}
									disabled={btn.disabled}
								>
									{btn.text}
								</Button>
							)
						)}

						{task.created_by === userID && (
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
	);
}
