import { CloseButton } from "./Buttons";

export default function LegalNotice({ isVisible, setIsVisible, message }) {
	if (!message) {
		setIsVisible(false);
		return null;
	}
	return (
		<>
			{isVisible && (
				<dialog open id="legal-dialog" className="dialog">
					<CloseButton setIsVisible={setIsVisible} />
					<h3>Legal Notice</h3>
					<p>
						This website is operated by{" "}
						<strong>Wisdom of the Crowd Labs Ltd</strong>, a not-for-profit UCL
						spinout company registered in England and Wales.<br></br>
						<strong>Registered Office:</strong> ExCiteS C/O WCL, Geography
						Department, University College London, Gower St, London, United
						Kingdom, WC1E 6BT<br></br>
						<strong>Company Registration Number:</strong> 15934186<br></br>
						<strong>Contact:</strong> info@kapta.earth<br></br>
						All content on this website is protected by copyright and other
						applicable laws. Wisdom of the Crowd Labs Ltd accepts no liability
						for external links or third-party content.<br></br>
						<strong>Governing Law:</strong> This website and its use are
						governed by the laws of England and Wales
					</p>
				</dialog>
			)}
		</>
	);
}
