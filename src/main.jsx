import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./UserContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<UserProvider>
			<App />
		</UserProvider>
	</StrictMode>
);
