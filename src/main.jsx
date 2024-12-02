import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./utils/UserContext.jsx";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, orange, grey, teal } from "@mui/material/colors";
import { isMobileDevice } from "./utils/generalUtils.js";
import TempMobileApp from "./TempMobileApp.jsx";

const theme = createTheme({
	palette: {
		mode: "dark",
		primary: { main: "#25D366" },
		secondary: { main: grey[300], contrastText: "#075E54", dark: grey[600] },
		info: teal,
		info2: { main: "#075E54", contrastText: grey[200] }, // WA dark teal
		info3: { main: "#25d3bc", contrastText: grey[200] }, // lighter bluer teal
		error: red,
		warning: orange,
		white: {
			main: "#f5f5f5",
			contrastText: "#16161d",
		},
		muted: { main: grey[500] },
	},
	cssVariables: true,
});
const isMobile = isMobileDevice();

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<UserProvider>
			{" "}
			<ThemeProvider theme={theme}>
				{isMobile ? <TempMobileApp /> : <App />}{" "}
			</ThemeProvider>
		</UserProvider>
	</StrictMode>
);
