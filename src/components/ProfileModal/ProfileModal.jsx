import { useContext, useState } from 'react';
import styles from '../ProfileModal/ProfileModal.module.css';
import { UserContext } from '../../contexts/contexts';
import { updateUserProfile } from '../../api/todoWebApi'
import { useNavigate } from 'react-router-dom';

const UserProfileModal = ({ onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { user, setUser, fetchCurrentUser } = useContext(UserContext);
    const [email, setEmail] = useState(user.email || '');
    const [username, setName] = useState(user.username || '');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        const trimmedUsername = username.trim();

        setEmailError('');
        setUsernameError('');

        const isEmailUnchanged = trimmedEmail === user.email;
        const isUsernameUnchanged = trimmedUsername === user.username;

        if (isEmailUnchanged && isUsernameUnchanged) {
            alert("No changes detected in email or username.");
            return;
        }

        if (!trimmedEmail) {
            setEmailError("Email cannot be empty.");
            return;
        }

        if (!trimmedEmail.toLowerCase().endsWith("@gmail.com")) {
            setEmailError("Only @gmail.com emails are allowed.");
            return;
        }

        if (!trimmedUsername) {
            setUsernameError("Username cannot be empty.");
            return;
        }

        await updateUser(trimmedEmail, trimmedUsername);
    };

    const updateUser = async (newEmail, newUsername) => {
        const userUpdatePayload = { email: newEmail, username: newUsername };

        try {
            const response = await updateUserProfile(userUpdatePayload);
            console.log("RESPONSE :", response)
            if (response === 'success email is updated') {
                alert("User email is updated successfully, Please login again.");
                navigate('/', { replace: true })
            } else if (response === 'success') {
                alert("User name is updated")
                await fetchCurrentUser();
            } else if (response === 'bad request') {
                if (response.message.toLowerCase().includes("email")) {
                    setEmailError(response.message);
                } else if (response.message.toLowerCase().includes("username")) {
                    setUsernameError(response.message);
                } else {
                    alert(response.message);
                }
            } else if (response === 'session expired') {
                alert("Session expired. Please re-login.");
                navigate('/', { replace: true });
            } else {
                alert("Unexpected error occurred. please re-login");
            }
        } catch (error) {
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2 className={styles.heading}>Profile</h2>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                            className={styles.input}
                        />
                        {emailError && <p style={{ color: "red" }}>{emailError}</p>}

                        <label>Name</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setName(e.target.value);
                                setUsernameError('');
                            }}
                            className={styles.input}
                        />
                        {usernameError && <p style={{ color: "red" }}>{usernameError}</p>}

                        <div className={styles.buttonGroup}>
                            <button type="submit" className={styles.saveBtn}>Save</button>
                            <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.profileView}>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Name:</strong> {username}</p>
                        <div className={styles.buttonGroup}>
                            <button onClick={() => setIsEditing(true)} className={styles.editBtn}>Edit</button>
                            <button onClick={onClose} className={styles.closeBtn}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileModal;
