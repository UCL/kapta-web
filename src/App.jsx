import { Button, ButtonGroup } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./styles/App.css";
import TaskForm from "./TaskForm";
import { useState } from "react";
import LoginForm from "./LoginForm";
import { useUserStore } from "./globals";
import TaskList from "./TaskList";
import { Map } from "./Mapbox";
import SearchForm from "./SearchForm";
import SignUpForm from "./SignUpForm";
import ErrorModal from "./utils/ErrorModal";

export default function App() {
	const [isTaskFormVisible, setTaskFormVisible] = useState(false);
	const [isTaskListVisible, setTaskListVisible] = useState(false);
	const [taskValues, setTaskValues] = useState(null);

	const [isLoginFormVisible, setLoginFormVisible] = useState(false);
	const [signUpVisible, setSignUpVisible] = useState(false);

	// const [errorModalVisible, setErrorModalVisible] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const [isSearchFormVisible, setSearchFormVisible] = useState(false);

	const user = useUserStore();

	const showTaskForm = (task) => {
		console.log("task exists!", task);
		setTaskValues(task);
		setTaskFormVisible(true);
	};
	return (
		<main>
			{errorMsg && <ErrorModal message={errorMsg} />}
			{!isLoginFormVisible && !user.loggedIn && !signUpVisible && (
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
				setSignUpVisible={setSignUpVisible}
				setErrorMsg={setErrorMsg}
			/>
			<SignUpForm isVisible={signUpVisible} setIsVisible={setSignUpVisible} />

			{user.loggedIn && (
				<>
					<div className="btn-container">
						<Button
							color="info"
							variant="outlined"
							onClick={() => setSearchFormVisible(true)}
							className="btn--search"
							size="medium"
						>
							Search
						</Button>
						<div className="btn-container--tasks">
							<ButtonGroup
								disableElevation
								variant="outlined"
								aria-label="task button group"
								size="medium"
								color="info"
							>
								<Button
									onClick={() => setTaskFormVisible(true)}
									className="btn--new-task"
									startIcon={<AddIcon />}
								>
									New
								</Button>
								<Button
									onClick={() => setTaskListVisible(true)}
									className="btn--view-tasks"
									startIcon={<VisibilityIcon />}
								>
									View
								</Button>
							</ButtonGroup>
						</div>
					</div>

					<Map />

					<TaskForm
						isVisible={isTaskFormVisible}
						setIsVisible={setTaskFormVisible}
						user={user}
						taskValues={taskValues}
					/>
					<TaskList
						isVisible={isTaskListVisible}
						setIsVisible={setTaskListVisible}
						user={user}
						showTaskForm={showTaskForm}
					/>
					<SearchForm isVisible={isSearchFormVisible} />
				</>
			)}
		</main>
	);
}
