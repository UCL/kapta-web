import Helmet from "react-helmet";
import { CloseButton } from "./Buttons";
export default function WaitlistWidget({ isVisible, setIsVisible }) {
	if (!isVisible) return null;
	return (
		<div className="waitlist-widget">
			<CloseButton setIsVisible={setIsVisible} />
			<div
				id="getWaitlistContainer"
				data-waitlist_id="22786"
				data-widget_type="WIDGET_1"
			></div>
			<Helmet>
				<link
					rel="stylesheet"
					type="text/css"
					href="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css"
				/>
				<script src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"></script>
			</Helmet>
		</div>
	);
}
