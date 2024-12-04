import { CloseButton } from "./Buttons";

export default function PosterModal({ isVisible, setIsVisible }) {
	return (
		<>
			{isVisible && (
				<dialog open id="poster-dialog" className="dialog">
					<CloseButton setIsVisible={setIsVisible} />
					<img
						src="/Poster_cs_1.svg"
						alt="Is this the first-ever WhatsApp Map?"
					/>
				</dialog>
			)}
		</>
	);
}
