import { useState } from "react";
import CloseButton from "./CloseButton";
import { useAutoClose } from "./autoCloseHook";

export default function ErrorModal({ message }) {
	const [isVisible, setIsVisible] = useState(true);
	// close automatically after 5s
	useAutoClose(isVisible, setIsVisible, 5000, true);

	if (!message) {
		setIsVisible(false);
		return null;
	}
	return (
		<>
			{isVisible && (
				<dialog open id="error-dialog" className="dialog">
					<CloseButton setIsVisible={setIsVisible} />
					<h3>{message}</h3>
				</dialog>
			)}
		</>
	);
}
