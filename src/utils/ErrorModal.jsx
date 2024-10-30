import { useState } from "react";
import CloseButton from "./CloseButton";

export default function ErrorModal({ message }) {
	const [isVisible, setIsVisible] = useState(true);
	if (!message) {
		setIsVisible(false);
		return null;
	}
	return (
		<>
			{isVisible && (
				<dialog open id="error-dialog">
					<CloseButton setIsVisible={setIsVisible} />
					<h3>{message}</h3>
				</dialog>
			)}
		</>
	);
}
