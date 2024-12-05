import DangerousIcon from "@mui/icons-material/Dangerous";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PasswordStrengthContainer({
	passwordStrength
}) {
    return (
		<>
            <div className="password-strength__container">
                <h4>Password must contain:</h4>
                <ul>
                    <li style={{ color: passwordStrength.minLength ? "green" : "red" }}>
                        {passwordStrength.minLength ? (
                            <CheckCircleIcon />
                        ) : (
                            <DangerousIcon />
                        )}
                        At least 8 characters
                    </li>
                    <li
                        style={{ color: passwordStrength.hasLowercase ? "green" : "red" }}
                    >
                        {passwordStrength.hasLowercase ? (
                            <CheckCircleIcon />
                        ) : (
                            <DangerousIcon />
                        )}
                        At least one lowercase letter
                    </li>
                    <li
                        style={{ color: passwordStrength.hasUppercase ? "green" : "red" }}
                    >
                        {passwordStrength.hasUppercase ? (
                            <CheckCircleIcon />
                        ) : (
                            <DangerousIcon />
                        )}
                        At least one uppercase letter
                    </li>
                    <li style={{ color: passwordStrength.hasDigit ? "green" : "red" }}>
                        {passwordStrength.hasDigit ? (
                            <CheckCircleIcon />
                        ) : (
                            <DangerousIcon />
                        )}
                        At least one digit
                    </li>
                    <li style={{ color: passwordStrength.hasSymbol ? "green" : "red" }}>
                        {passwordStrength.hasSymbol ? (
                            <CheckCircleIcon />
                        ) : (
                            <DangerousIcon />
                        )}
                        At least one special character
                    </li>
                </ul>
            </div>
        </>
    )
}