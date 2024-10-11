import "./App.css";
import TaskForm from "./TaskForm";

export const REQUEST_URL =
	"https://5fpm1iy0s4.execute-api.eu-west-2.amazonaws.com";

export const METADATA_URL =
	"https://poeddd3g4f.execute-api.eu-west-2.amazonaws.com";

export default function App() {
	return <TaskForm />;
}
