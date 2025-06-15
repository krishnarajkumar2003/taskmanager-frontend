import { useNavigate, useLocation } from "react-router-dom";
import style from '../../pages/Home/UserHome.module.css';
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import UserProfileModal from "../ProfileModal/ProfileModal";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleHomeClick = () => {
        if (location.pathname === '/user/home') {
            window.location.reload();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsOpen(false)
        alert("Logged out successfully")
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
                        <li onClick={handleLogout}>🚪 Logout</li>
                    </ul>
                </div>
            </div>

            {showProfileModal && (
                <UserProfileModal
                    onClose={() => setShowProfileModal(false)}
                />
            )}
        </>
    );
}

export default Sidebar;
