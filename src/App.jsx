import { Button, Fab } from "@mui/material";
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
import SearchResults from "./SearchResultsList";

export default function App() {
	const [isTaskFormVisible, setTaskFormVisible] = useState(false);
	const [isTaskListVisible, setTaskListVisible] = useState(false);
	const [taskValues, setTaskValues] = useState(null);

	const [isLoginFormVisible, setLoginFormVisible] = useState(false);
	const [signUpFormVisible, setSignUpFormVisible] = useState(false);
	const [email, setEmail] = useState("");
	const [confirmModalVisible, setConfirmModalVisible] = useState(false);
	const [cmRecipient, setCMRecipient] = useState(null);

	const [successModalVisible, setSuccessModalVisible] = useState(false);
	const [successMsg, setSuccessMsg] = useState(null);
	const [successIsTask, setSuccessIsTask] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const [searchResultsVisible, setSearchResultsVisible] = useState(false);
	const [searchResults, setSearchResults] = useState([]);

	const [BMopen, setBMopen] = useState(false);

	const [boundsVisible, setBoundsVisible] = useState(false);
	const [polygonStore, setPolygonStore] = useState(null);
	const [focusTask, setFocusTask] = useState(null);
	const [chosenTask, setChosenTask] = useState(null);

	const [taskListName, setTaskListName] = useState("mine");

	const user = useUserStore();

	const showTaskForm = (task) => {
		setTaskValues(task);
		setTaskFormVisible(true);
		setTaskListVisible(false);
	};

	const showNewTaskForm = () => {
		setTaskValues(null);
		setTaskListVisible(false);
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
		setEmail("");
	};

	const showFilledLoginForm = (email) => {
		setSignUpFormVisible(false);
		setEmail(email);
		setLoginFormVisible(true);
	};
	const showTaskSuccessModal = (message) => {
		setSuccessModalVisible(true);
		setSuccessMsg(message);
		setSuccessIsTask(true);
	};

	const showBounds = (tasks) => {
		setPolygonStore(tasks);
		setBoundsVisible(true);
	};

	const getPolygons = (results) => {
		let polygons = [];
		results.forEach((task) => {
			if (task.geo_bounds) {
				polygons.push(task);
			}
		});
		return polygons;
	};

	const showSearchResults = (results) => {
		if (results !== searchResults) {
			setPolygonStore(null); // reset polygon store for each new search
			setSearchResults(results);
		}
		if (!searchResultsVisible) {
			setSearchResultsVisible(true);
		}
		const polygons = getPolygons(results);
		if (polygons.length > 0) {
			return showBounds(polygons);
		}
	};

	const showTaskInList = (id) => {
		setChosenTask(id);
		setTaskListVisible(true);
	};

	const scrollFlashTask = (taskRefs) => {
		// Scroll to the chosen task
		taskRefs.current[chosenTask].scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
		// Make it flash
		const taskElement = taskRefs.current[chosenTask];
		taskElement.classList.add("flash");

		// Remove the flash class after the animation duration
		setTimeout(() => {
			taskElement.classList.remove("flash");
			setChosenTask(null);
		}, 1600);
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
				prefilledEmail={email}
			/>
			<SignUpForm
				isVisible={signUpFormVisible}
				setIsVisible={setSignUpFormVisible}
				showConfirmModal={showConfirmModal}
				showFilledLoginForm={showFilledLoginForm}
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

					{/* <div className="response-container"> */}
					{/* this is where the bot responses will go */}
					{/* </div> */}
					<div className="task-map-wrapper">
						<Map
							boundsVisible={boundsVisible}
							polygonStore={polygonStore}
							taskListOpen={isTaskListVisible || searchResultsVisible}
							focusTask={focusTask}
							showTaskInList={showTaskInList}
						/>
						<TaskList
							isVisible={isTaskListVisible}
							setIsVisible={setTaskListVisible}
							user={user}
							showTaskForm={showTaskForm}
							showNewTaskForm={showNewTaskForm}
							showBounds={showBounds}
							setFocusTask={setFocusTask}
							chosenTask={chosenTask}
							scrollFlashTask={scrollFlashTask}
							taskListName={taskListName}
							setTaskListName={setTaskListName}
						/>

						<SearchResults
							isVisible={searchResultsVisible}
							setIsVisible={setSearchResultsVisible}
							results={searchResults}
							setFocusTask={setFocusTask}
							chosenTask={chosenTask}
							scrollFlashTask={scrollFlashTask}
						/>
						<SearchForm
							showSearchResults={showSearchResults}
							taskListOpen={isTaskListVisible || searchResultsVisible}
						/>
					</div>
					<TaskForm
						isVisible={isTaskFormVisible}
						setIsVisible={setTaskFormVisible}
						user={user}
						taskValues={taskValues}
						showTaskSuccessModal={showTaskSuccessModal}
					/>
					<Fab
						size="medium"
						variant="extended"
						color="tomato"
						onClick={() => setTaskListVisible(true)}
						className="btn--view-tasks"
					>
						TASKS
					</Fab>
				</>
			)}
		</main>
	);
}
