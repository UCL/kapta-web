import { Button } from "@mui/material";
import "./styles/App.css";
import TaskForm from "./TaskForm";
import { useState } from "react";

export const REQUEST_URL =
	"https://5fpm1iy0s4.execute-api.eu-west-2.amazonaws.com";

export const METADATA_URL =
	"https://poeddd3g4f.execute-api.eu-west-2.amazonaws.com";

export default function App() {
	const [isTaskFormVisible, setTaskFormVisible] = useState(false);

	const showTaskForm = () => {
		setTaskFormVisible(true);
	};
	return(
		<main>
		<Button variant="outlined" onClick={showTaskForm} color="primary">New Task Request</Button>
		
		<TaskForm isVisible={isTaskFormVisible}	/>
		</main>);
}
