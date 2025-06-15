import { useEffect, useMemo, useState } from 'react';
import styles from './AdminHome.module.css';
import Sidebar from '../../components/SideBar/SideBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import UserList from '../../components/UserList/UserList';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, deleteUserById, fetchProfile } from '../../api/todoWebApi';
import { UserContext } from '../../contexts/TaskContext';
const AdminHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [originalUsers, setOriginalUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetchAllUsers();
                if (typeof response === 'string') {
                    if (response === 'session expired') {
                        alert("Session expired. Please login again.");
                        navigate('/', { replace: true });
                        return;
                    } else if (response === 'bad request') {
                        alert("Bad request. Please try again.");
                        return;
                    } else if (response === 'server error') {
                        alert("Server error. Please try again later.");
                        return;
                    }
                }

                setOriginalUsers(response);
                await fetchCurrentUser()
            } catch (error) {
                console.error('Error fetching users:', error);
                alert("Unexpected error occurred.");
                navigate('/', { replace: true });
            } finally {
                setTimeout(() => setIsLoading(false), 2000);
            }
        };

        fetchUsers();
    }, [navigate]);

    async function fetchCurrentUser() {
        const response = await fetchProfile();

        if (response === 'forbidden') {
            alert("Access forbidden. Please login with proper credentials.");
            navigate('/', { replace: true });
        } else if (response.statusCode === 200) {
            const { email, username } = response.data;
            setUser({ email, username });
        } else if (response === 'bad request') {
            alert("Bad request. Please try again.");
        } else if (response === 'server error') {
            alert("Server error. Please try again later.");
        }
    }
    const filteredUsers = useMemo(() => {
        return originalUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [originalUsers, searchTerm]);

    const handleDelete = async (userId) => {
        const response = await deleteUserById(userId);
        if (response === 'success') {
            const updatedUsers = originalUsers.filter(user => user.id !== userId);
            setOriginalUsers(updatedUsers);
        } else if (response === 'user not found') {
            alert("User not found.");
        } else if (response === 'forbidden') {
            alert("You are not allowed to delete this user.");
        } else if (response === 'session expired') {
            alert("Session expired. Please login again.");
            navigate('/', { replace: true });
        } else {
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className={styles.home}>
            <UserContext.Provider value={{ user, setUser, fetchCurrentUser }}>
                <Sidebar />
            </UserContext.Provider><div className={styles.content}>
                <div className={styles.adminContainer}>
                    {user?.username && <span>👋 Welcome, {user.username}</span>}
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <div className={styles.loader}></div>
                    </div>
                ) : (
                    <UserList users={filteredUsers} onDelete={handleDelete} />
                )}
            </div>
        </div>
    );
};

export default AdminHome;
