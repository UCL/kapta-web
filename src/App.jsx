import { Button } from "@mui/material";
import "./styles/App.css";
import TaskForm from "./TaskForm";
import { useState } from "react";
import LoginForm from "./LoginForm";
import { useUserStore } from "./globals";

export default function App() {
	const [isTaskFormVisible, setTaskFormVisible] = useState(false);
	const [isLoginFormVisible, setLoginFormVisible] = useState(false);

	const user = useUserStore();

	// TODO: add mapbox background thing

	return (
		<main>
			{!isLoginFormVisible && (
				<Button
					variant="outlined"
					onClick={() => {
						setLoginFormVisible(true);
					}}
					className="btn--login"
				>
					Login
				</Button>
			)}
			<LoginForm
				isVisible={isLoginFormVisible}
				setIsVisible={setLoginFormVisible}
			/>
			{user.loggedIn && (
				<Button
					color="white"
					variant="outlined"
					onClick={() => setTaskFormVisible(true)}
					className="btn--new-task"
				>
					New Task Request
				</Button>
			)}

			<TaskForm isVisible={isTaskFormVisible} />
		</main>
	);
}
