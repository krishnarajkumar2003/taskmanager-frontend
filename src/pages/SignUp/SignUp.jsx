import { useCallback, useRef, useState } from 'react';
import style from '../AuthPage/AuthPage.module.css';
import { registerUser } from '../../api/todoWebApi'
function SignUp({ setIsLogInSelected }) {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const toggleShowPassword = useCallback(() => setShowPassword(prev => !prev), []);

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
        let currentUsername = usernameRef.current.value.trim();
        const currentEmail = emailRef.current.value.trim();
        const currentPassword = passwordRef.current.value.trim();
        let canSubmitForm = true;

        if (currentUsername === "") {
            setNameError("Please enter your username");
            canSubmitForm = false;
        }

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
                setPasswordError("Password should contain at least 1 special character, 1 uppercase letter, and 1 number");
                canSubmitForm = false;
            }
        }

        if (canSubmitForm) {
            handleSignUp(currentEmail, currentPassword, currentUsername);
        }

    }, [validateEmail, validatePassword])



    async function handleSignUp(email, password, username) {
        try {
            setIsSubmitting(true);
            const registerData = { username, email, password };
            const result = await registerUser(registerData);

            if (typeof result === "string") {
                switch (result) {
                    case "bad request":
                        alert("Bad credentials. Please fill all the fields.");
                        break;
                    case "registration failed":
                        setEmailError("This email or username is already registered or username is not unique.");
                        break;
                    case "server error":
                        alert("Server error. Please try again later.");
                        break;
                    default:
                        alert("Unexpected error occurred during registration.");
                }
                return;
            }

            if (result?.statusCode === 201) {
                emailRef.current.value = '';
                usernameRef.current.value = '';
                passwordRef.current.value = '';
                alert("Account registered successfully. Awaiting admin approval.")
            } else {
                alert("Unexpected error. Please try again.");
            }

        } catch (error) {
            console.error("Registration exception:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }



    return (
        <form onSubmit={submitForm} className={style.signUpForm} noValidate>
            <div className={style.welcomeBox}>
                <h2>CREATE ACCOUNT</h2>
                <h6 className={style.welcomeMessage}>
                    Sign up and get started with your account.
                </h6>
            </div>

            <div className={style.name}>
                <label style={{ fontSize: "1.5rem" }}>Name</label>
                <input
                    name="name"
                    ref={usernameRef}
                    type="text"
                    className={style.nameField}
                    onFocus={() => setNameError("")}
                />
                <div className={style.errorText}>{nameError}</div>
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
                    className={style.togglePassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? "👀" : "🔒"}
                </span>
                <div className={style.errorText}>{passwordError}</div>
            </div>
            <p style={{ marginTop: `${passwordError ? "-10px" : "-30px"}`, fontSize: "20px", position: "relative", left: "70px" }}>
                Already have an account?
                <span
                    onClick={() => setIsLogInSelected(true)}
                    style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                >
                    Sign In
                </span>
            </p>
            <button type="submit" className={style.signUpButton} disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Sign Up"}
            </button>
        </form >
    );
}

export default SignUp;
