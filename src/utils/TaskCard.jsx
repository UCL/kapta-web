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
import PlaceIcon from "@mui/icons-material/Place";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
export default function TaskCard({
	task,
	cardActionBtns,
	handleCopy,
	handleEdit,
	userID,
}) {
	let codeVisible = false;
	if (task.created_by === userID) {
		codeVisible = true;
	} else if (!task.private) {
		codeVisible = true;
	}

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
