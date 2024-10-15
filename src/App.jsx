import { Button } from "@mui/material";
import "./styles/App.css";
import TaskForm from "./TaskForm";
import { useState } from "react";
import LoginForm from "./LoginForm";

export default function App() {
	const [isTaskFormVisible, setTaskFormVisible] = useState(false);
	const [isLoginFormVisible, setLoginFormVisible] = useState(false);

	//TODO: add a login, hide the buttons based on login
	// TODO: add mapbox background thing

	return (
		<main>
			<Button
				variant="outlined"
				onClick={() => setLoginFormVisible(true)}
				className="btn--login"
			>
				Login
			</Button>
			<LoginForm isVisible={isLoginFormVisible} />

			<Button
				variant="outlined"
				onClick={() => setTaskFormVisible(true)}
				className="btn--new-task"
			>
				New Task Request
			</Button>

			<TaskForm isVisible={isTaskFormVisible} />
		</main>
	);
}
