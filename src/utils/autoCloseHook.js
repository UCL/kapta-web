import { useEffect } from "react";

export function useAutoClose(
	isOpen,
	closeFunction,
	duration = 10000,
	condition = true
) {
	useEffect(() => {
		let timer;
		if (isOpen && condition) {
			timer = setTimeout(() => {
				closeFunction(false);
			}, duration);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isOpen, closeFunction, duration, condition]);
}
