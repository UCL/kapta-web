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
import LegalNotice from "./utils/LegalNoticeModal";
import PosterModal from "./utils/PosterModal";
import { KaptaSVGIconWhite } from "./utils/icons";
import WaitlistWidget from "./utils/WaitlistWidget";

export default function App() {
	const [isTaskFormVisible, setTaskFormVisible] = useState(false);
	const [isTaskListVisible, setTaskListVisible] = useState(false);
	const [taskValues, setTaskValues] = useState(null);

	const [isLoginFormVisible, setLoginFormVisible] = useState(false);
	const [signUpFormVisible, setSignUpFormVisible] = useState(false);
	const [waitlistVisible, setWaitlistVisible] = useState(false);
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
	const [polygonStore, setPolygonStore] = useState(null); // for showing polygons
	const [focusTask, setFocusTask] = useState(null); // for showing data points
	const [chosenTaskId, setChosenTaskId] = useState(null); // for showing task in list from popup

	const [taskListName, setTaskListName] = useState("mine");

	const [noticeVisible, setNoticeVisible] = useState(false);
	const [posterVisible, setPosterVisible] = useState(false);

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
		// setSuccessModalVisible(true);
		// setSuccessMsg(message);
		// setSuccessIsTask(false);
		// setEmail("");
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
		console.log("polygons", polygons);
		return polygons;
	};

	const showSearchResults = (results) => {
		setBoundsVisible(false);
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
		console.log("show task in list", id);
		setChosenTaskId(id);
		setTaskListVisible(true);
	};

	const scrollFlashTask = (taskRefs) => {
		// if (!isTaskListVisible) setTaskListVisible(true);
		console.log("scroll flash", taskRefs, chosenTaskId);
		// Scroll to the chosen task
		taskRefs.current[chosenTaskId].scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
		// Make it flash
		const taskElement = taskRefs.current[chosenTaskId];
		taskElement.classList.add("flash");

		// Remove the flash class after the animation duration
		setTimeout(() => {
			taskElement.classList.remove("flash");
			setChosenTaskId(null);
		}, 2600);
	};

	return (
		<>
			<main>
				<div className="kapta-logo--main">
					<KaptaSVGIconWhite />
					<strong>Kapta</strong>
				</div>
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
								setWaitlistVisible(true);
							}}
							className="btn--signup"
						>
							Join Waitlist
						</Button>
					</div>
				)}
				<WaitlistWidget
					isVisible={waitlistVisible}
					setIsVisible={setWaitlistVisible}
				/>
				<LoginForm
					isVisible={isLoginFormVisible}
					setIsVisible={setLoginFormVisible}
					setSignUpVisible={setWaitlistVisible}
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
				<LegalNotice
					isVisible={noticeVisible}
					setIsVisible={setNoticeVisible}
				/>
				<PosterModal
					isVisible={posterVisible}
					setIsVisible={setPosterVisible}
				/>
				<BurgerMenu
					isOpen={BMopen}
					setIsOpen={setBMopen}
					setNoticeVisible={setNoticeVisible}
					setPosterVisible={setPosterVisible}
				/>

				{!user.loggedIn && <div className="background shield"></div>}

				<div className="search-response-wrapper">
					<div className="response-container">
						{/* this is where the bot responses will go */}
					</div>

					<SearchForm
						showSearchResults={showSearchResults}
						taskListOpen={isTaskListVisible || searchResultsVisible}
						isBackground={!user.loggedIn}
					/>
				</div>
				<div className="task-map-wrapper">
					<Map
						boundsVisible={boundsVisible}
						polygonStore={polygonStore}
						taskListOpen={isTaskListVisible || searchResultsVisible}
						focusTask={focusTask}
						showTaskInList={showTaskInList}
						isBackground={!user.loggedIn}
					/>

					<TaskList
						isVisible={user.loggedIn && isTaskListVisible}
						setIsVisible={setTaskListVisible}
						user={user}
						showTaskForm={showTaskForm}
						showNewTaskForm={showNewTaskForm}
						showBounds={showBounds}
						setFocusTask={setFocusTask}
						chosenTaskId={chosenTaskId}
						scrollFlashTask={scrollFlashTask}
						taskListName={taskListName}
						setTaskListName={setTaskListName}
					/>

					<SearchResults
						isVisible={user.loggedIn && searchResultsVisible}
						setIsVisible={setSearchResultsVisible}
						results={searchResults}
						setFocusTask={setFocusTask}
						chosenTaskId={chosenTaskId}
						scrollFlashTask={scrollFlashTask}
					/>
					<Fab
						size="medium"
						variant="extended"
						color="primary"
						onClick={() => setTaskListVisible(true)}
						className="btn--view-tasks"
						disabled={!user.loggedIn}
					>
						Task WhatsApp Mappers
					</Fab>
				</div>
				<TaskForm
					isVisible={isTaskFormVisible}
					setIsVisible={setTaskFormVisible}
					user={user}
					taskValues={taskValues}
					showTaskSuccessModal={showTaskSuccessModal}
				/>
			</main>
		</>
	);
}
