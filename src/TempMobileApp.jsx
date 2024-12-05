import { Button } from "@mui/material";
import { WA_CHAT_URL } from "./globals";

export default function TempMobileApp() {
	return (
		<div className="temp-mobile-app">
			<h2>The mobile version of this site is currently under development.</h2>
			<p>Please visit on a computer to explore with KAPTA</p>

			<Button href={WA_CHAT_URL} variant="outlined">
				WhatsApp Maps Assistant
			</Button>
		</div>
	);
}
