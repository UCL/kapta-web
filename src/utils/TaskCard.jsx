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

export default function TaskCard({
	task,
	showTaskOnMap,
	handleCopy,
	user,
	handleEdit,
	displayedTask,
	setDisplayedTask,
	setFocusTask,
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
		setIsLoading(true);

		const data = await getDataFromBucket({ user, task });

		if (data.response !== 200) {
			// todo: show an error
			return;
		} else {
			const txtContent = data.content.txtFileContent;
			const jsonContent = data.content.jsonFileContent;

			const zip = new JSZip();

			zip.file(`${task.task_title}-${task.campaign_code}.txt`, txtContent);
			zip.file(`${task.task_title}-${task.campaign_code}.geojson`, jsonContent);

			setIsLoading(false);

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

	const showDataPoints = async (task) => {
		const data = await getDataFromBucket({ user, task });
		const geojson = data.content.jsonFileContent;
		const featureCollection = JSON.parse(geojson);
		console.log("geojson", featureCollection.features.length);
		setFocusTask(featureCollection);
	};

	const cardActionBtns = [
		{
			text:
				taskId === displayedTask?.task_id ? "Show data points" : "Show on Map",
			icon: <PinDropIcon />,
			action:
				taskId === displayedTask?.task_id
					? (task) => showDataPoints(task)
					: (task) => {
							setFocusTask(null);
							showTaskOnMap(task);
							setDisplayedTask(task);
					  },
			variant: "contained",
			loading: false,
		},

		{
			text: "Download Data",
			icon: <DownloadIcon />,
			action: (task) => handleDownload(task),
			variant: "outlined",
			color: "orange",
			loading: true,
		},
	];

	// todo: if task list is od use a tag to show if it belogs to the user, if org===opendata? may want to do this on the parent level

	return (
		<Card className="task-card">
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
									loading={isLoading}
									loadingPosition="start"
									color={btn.color}
									startIcon={btn.icon}
									onClick={() => btn.action(task)}
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
