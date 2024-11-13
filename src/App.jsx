import { Button, ButtonGroup } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LoginIcon from "@mui/icons-material/Login";
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
import ConfirmModal from "./utils/ConfirmationModal";
import SuccessModal from "./SuccessModal";
import BurgerMenu from "./BurgerMenu";

export default function App() {
	const [isTaskFormVisible, setTaskFormVisible] = useState(false);
	const [isTaskListVisible, setTaskListVisible] = useState(false);
	const [taskValues, setTaskValues] = useState(null);

	const [isLoginFormVisible, setLoginFormVisible] = useState(false);
	const [signUpFormVisible, setSignUpFormVisible] = useState(false);
	const [confirmModalVisible, setConfirmModalVisible] = useState(false);
	const [cmRecipient, setCMRecipient] = useState(null);

	const [successModalVisible, setSuccessModalVisible] = useState(false);
	const [successMsg, setSuccessMsg] = useState(null);
	const [successIsTask, setSuccessIsTask] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const [BMopen, setBMopen] = useState(false);

	const [boundsVisible, setBoundsVisible] = useState(false);
	const [polygonStore, setPolygonStore] = useState(null);
	// todo: polygon store if we're showing multiple?

	const user = useUserStore();

	const showTaskForm = (task) => {
		setTaskValues(task);
		setTaskFormVisible(true);
	};

	const showNewTaskForm = () => {
		setTaskValues(null);
		setTaskFormVisible(true);
	};

	const showConfirmModal = (recipient) => {
		setCMRecipient(recipient);
		setConfirmModalVisible(true);
	};
	const showLoginSuccessModal = (message) => {
		setSuccessModalVisible(true);
		setSuccessMsg(message);
		setSuccessIsTask(false);
	};
	const showTaskSuccessModal = (message) => {
		setSuccessModalVisible(true);
		setSuccessMsg(message);
		setSuccessIsTask(true);
	};

	const showBounds = (bounds) => {
		// this is for showing one at a time
		setPolygonStore(bounds);
		setBoundsVisible(true);
	};

	return (
		<main>
			{errorMsg && <ErrorModal message={errorMsg} />}
			{!isLoginFormVisible && !user.loggedIn && !signUpFormVisible && (
				<div className="login-signup__wrapper">
					<Button
						variant="outlined"
						onClick={() => {
							setLoginFormVisible(true);
						}}
						startIcon={<LoginIcon />}
						className="btn--login"
					>
						Login
					</Button>
					<Button
						color="secondary"
						variant="outlined"
						onClick={() => {
							setSignUpFormVisible(true);
						}}
						className="btn--signup"
					>
						Sign Up
					</Button>
				</div>
			)}
			<LoginForm
				isVisible={isLoginFormVisible}
				setIsVisible={setLoginFormVisible}
				setSignUpVisible={setSignUpFormVisible}
				setErrorMsg={setErrorMsg}
				showConfirmModal={showConfirmModal}
				showLoginSuccessModal={showLoginSuccessModal}
			/>
			<SignUpForm
				isVisible={signUpFormVisible}
				setIsVisible={setSignUpFormVisible}
				setLoginVisible={setLoginFormVisible}
				showConfirmModal={showConfirmModal}
				showLoginSuccessModal={showLoginSuccessModal}
			/>
			{confirmModalVisible && (
				<ConfirmModal
					isVisible={confirmModalVisible}
					setIsVisible={setConfirmModalVisible}
					recipient={cmRecipient}
					showLoginSuccessModal={showLoginSuccessModal}
				/>
			)}
			{successModalVisible && !successIsTask && (
				<SuccessModal
					taskTitle={successMsg}
					setSuccessModalVisible={setSuccessModalVisible}
					isTask={successIsTask}
				/>
			)}
			{successModalVisible && successIsTask && (
				<SuccessModal
					taskTitle={successMsg.title}
					taskDescription={successMsg.description}
					taskID={successMsg.taskID}
					campaignCode={successMsg.campaignCode}
					setSuccessModalVisible={setSuccessModalVisible}
					isTask={true}
				/>
			)}

			{user.loggedIn && (
				<>
					<BurgerMenu isOpen={BMopen} setIsOpen={setBMopen} />

					<div className="btn-container">
						<div className="btn-container--tasks">
							<ButtonGroup
								disableElevation
								variant="outlined"
								aria-label="task button group"
								size="medium"
								color="info"
							>
								<Button
									onClick={showNewTaskForm}
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

					<Map boundsVisible={boundsVisible} polygonStore={polygonStore} />

					<TaskForm
						isVisible={isTaskFormVisible}
						setIsVisible={setTaskFormVisible}
						user={user}
						taskValues={taskValues}
						showTaskSuccessModal={showTaskSuccessModal}
					/>
					<TaskList
						isVisible={isTaskListVisible}
						setIsVisible={setTaskListVisible}
						user={user}
						showTaskForm={showTaskForm}
						showBounds={showBounds}
					/>
					<SearchForm />
				</>
			)}
		</main>
	);
}
