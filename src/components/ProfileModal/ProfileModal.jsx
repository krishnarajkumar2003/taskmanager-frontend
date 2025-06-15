import { useContext, useState } from 'react';
import styles from '../ProfileModal/ProfileModal.module.css'
import { UserContext } from '../../contexts/TaskContext'; 
import { updateUserProfile } from '../../api/todoWebApi';

const UserProfileModal = ({ onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { user, setUser, fetchCurrentUser } = useContext(UserContext)
    const [email, setEmail] = useState(user.email || '');
    const [username, setName] = useState(user.username || '');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setEmail(user.email)
        }
        if (!username.trim()) {
            setUser(user.username)
        }

        updateUser();
    };


    async function updateUser() {
        const userUpdatePayload = { email, username };
        const response = await updateUserProfile(userUpdatePayload);
        if (response === 'success') {
            alert("User profile updated successfully")
            onClose()
            setIsEditing(false);
            await fetchCurrentUser()
        }
        else if (response === 'session expired') {
            alert("Session expired. Please re-login.");
            navigate('/', { replace: true });
        }
        else if (response === 'bad request') {
            alert("Email or username already exits")
        } else if (response === 'server error') {
            alert("Something went wrong. Please try again later.");
        } else if (response.statusCode === 400) {
            alert(response.message);
        } else if (response.statusCode === 200) {
            setUser(response.data);
            onClose();
        } else {
            alert("Unexpected error occurred.");
        }
    }

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
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                        <label>Name</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />
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
