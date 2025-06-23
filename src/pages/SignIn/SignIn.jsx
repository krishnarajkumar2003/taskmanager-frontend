import { useCallback, useRef, useState } from 'react';
import style from '../AuthPage/AuthPage.module.css';
import { loginUser, fetchProfile } from '../../api/todoWebApi'
import { useNavigate } from 'react-router-dom';
function SignIn({ setIsLogInSelected }) {
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();

    const toggleShowPassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const validateEmail = useCallback((email) => {
        const trimmedEmail = email.trim();
        const endsWithGmail = trimmedEmail.endsWith("@gmail.com");

        if (!endsWithGmail) return "Email must end with @gmail.com";
    }, []);

    const validatePassword = useCallback((password) => {
        password = password.trim();
        return password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /\d/.test(password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(password);
    }, []);

    const submitForm = useCallback((e) => {
        e.preventDefault();
        let currentEmail = emailRef.current.value.trim();
        const currentPassword = passwordRef.current.value.trim();
        let canSubmitForm = true;
        if (currentEmail === "") {
            setEmailError("Please enter your email ID");
            canSubmitForm = false;
        } else {
            const emailErrorMsg = validateEmail(currentEmail);
            if (emailErrorMsg) {
                setEmailError(emailErrorMsg);
                canSubmitForm = false;
            }
        }

        if (currentPassword === "") {
            setPasswordError("Please enter your password");
            canSubmitForm = false;
        } else {
            const isPasswordValid = validatePassword(currentPassword);
            if (!isPasswordValid) {
                setPasswordError("Password should contain atleast 1 special character, 1 uppercase letter, and 1 number");
                canSubmitForm = false;
            }
        }

        if (canSubmitForm) {
            setIsSubmitting(true);
            handleLogin(currentEmail, currentPassword);
        }
    }, [validateEmail, validatePassword]);


    async function handleLogin(email, password) {
        try {

            setIsSubmitting(true); // Set this before API call
            const loginData = { email, password };
            setIsLogInSelected(true);

            const result = await loginUser(loginData);

            console.log("LOG RES:", result)

            if (typeof result === "string") {
                switch (result) {
                    case "bad request":
                        alert("Bad credentials. Please provide both email and password.");
                        break;
                    case "email not registered":
                        alert("Email not registered. Please register this email & try login");
                        break;
                    case "login failed":
                        setEmailError("Invalid email or password.");
                        break;
                    default:
                        alert("Unexpected error occurred. Please try again later");
                }
                return;
            }

            if (result?.statusCode === 200 && result?.data !== null) {
                localStorage.setItem("token", result.data);
                console.log("Token stored:", localStorage.getItem("token"));


                const response = await fetchProfile();

                console.log("LOGGING RESPONSE:", response)


                if (response === 'session expired') {
                    alert("Your account is in waiting list for approval. Please login after approval")
                    return;
                }
                else if (response === 'forbidden') {
                    alert("Access forbidden. Please login with proper credentials.");
                    navigate('/', { replace: true });
                }
                else if (response === 'bad request') {
                    alert("Bad request. Please try again.");
                }
                else if (response === 'server error') {
                    alert("Server error. Please try again later.");
                }

                if (response.statusCode === 200 && response.data.accountStatus === "APPROVED") {
                    if (response.data.role === "ROLE_USER") {
                        console.log("Here not problem")
                        navigate('/user/home', { replace: true })
                    } else if (response.data.role === "ROLE_ADMIN") {
                        navigate("/admin/home", { replace: true });
                    }
                }

            } else if (result?.data === null) {
                alert("Your account is in waiting list for approval. Please login after approval")
            } else {
                alert("Unexpected response. Please try again.");
            }

        } catch (error) {
            console.error("Login exception:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <form onSubmit={submitForm} className={style.signInForm} noValidate>
            <div className={style.welcomeBox}>
                <h1>WELCOME BACK</h1>
                <h6 className={style.welcomeBack}>
                    Welcome back! Please enter your details.
                </h6>
            </div>

            <div className={style.email}>
                <label style={{ fontSize: "1.5rem" }}>Email</label>
                <input
                    name="email"
                    ref={emailRef}
                    type="email"
                    className={style.emailField}
                    onFocus={() => setEmailError("")}
                />
                <div className={style.errorText}>{emailError}</div>
            </div>

            <div className={style.password}>
                <label style={{ fontSize: "1.5rem" }}>Password</label>
                <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    className={style.passwordField}
                    onFocus={() => setPasswordError("")}
                />
                <span
                    onClick={toggleShowPassword}
                    style={{
                        position: "absolute",
                        right: "30px",
                        top: "40px",
                        fontSize: "25px",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? "👀" : "🔒"}
                </span>
                <div className={style.errorText}>{passwordError}</div>
            </div>
            <p style={{ marginTop: `${passwordError ? "-10px" : "-20px"}`, fontSize: "20px", position: "relative", left: "70px" }}>
                Didn't have an account?
                <span
                    onClick={() => setIsLogInSelected(false)}
                    style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                >
                    Sign up
                </span>
            </p>

            <button type="submit" className={style.signInButton} disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
        </form>
    );
}

export default SignIn;
