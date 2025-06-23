import { useNavigate } from "react-router-dom";
import style from '../../pages/Home/UserHome.module.css';
import { FaBars, FaTimes } from "react-icons/fa";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/contexts";
import UserProfileModal from "../ProfileModal/ProfileModal";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleHomeClick = () => {
        if (currentUser === "ROLE_ADMIN") {
            navigate("/admin/home");
        } else if (currentUser === "ROLE_USER") {
            navigate("/user/home");
        } else {
            alert("User role not recognized. Logging out.");
            localStorage.removeItem("token");
            navigate("/", { replace: true });
        }
        setIsOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsOpen(false);
        alert("Logged out successfully");
        navigate("/", { replace: true });
    };

    return (
        <>
            <button
                style={{ backgroundColor: "transparent" }}
                className={style.toggleBtn}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`${style.sidebarContainer} ${isOpen ? style.active : ''}`}>
                <div className={style.sidebar}>
                    <ul>
                        <li onClick={handleHomeClick}>🏠 Home</li>
                        <li onClick={() => setShowProfileModal(true)}>👤 Profile</li>

                        {/* My Created Tasks - visible to all roles
                        <li onClick={() => { navigate('/user/home/viewUsers', { replace: true }); setIsOpen(false); }}>📝 My Created Tasks</li> */}

                        {/* Admin-specific option */}
                        {currentUser === "ROLE_ADMIN" && (
                            <li onClick={() => { navigate('/admin/home/waitinglist'); setIsOpen(false); }}>
                                📃 View Waiting List
                            </li>
                        )}

                        {/* User-specific option */}
                        {currentUser === "ROLE_USER" && (
                            <li onClick={() => { navigate('/user/home/viewUsers'); setIsOpen(false); }}>
                                👥 View Users
                            </li>
                        )}

                        <li onClick={handleLogout}>🚪 Logout</li>
                    </ul>
                </div>
            </div>

            {showProfileModal && (
                <UserProfileModal onClose={() => setShowProfileModal(false)} />
            )}
        </>
    );
}

export default Sidebar;
