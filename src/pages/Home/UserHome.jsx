import { createContext, useEffect, useMemo, useState } from 'react';
import styles from './UserHome.module.css';
import FilterBar from '../../components/FilterBar/FilterBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import TaskList from '../../components/TaskList/TaskList';
import Sidebar from '../../components/SideBar/SideBar';
import { fetchAllTasks, fetchProfile } from '../../api/todoWebApi';
import { useNavigate } from 'react-router-dom';
import AddTaskModal from '../../components/AddTaskModel/AddTaskModal';
import { TaskContext, UserContext } from '../../contexts/TaskContext';


const UserHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [originalTasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getTasks = async () => {
            try {
                await fetchUserTasks();
                await fetchCurrentUser();
            } catch (error) {
                console.error("Error fetching tasks:", error);
                alert("Unexpected error occurred. Please login again.");
                navigate('/', { replace: true });
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
            }
        };

        getTasks();
    }, []);

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

    async function fetchUserTasks() {
        setIsLoading(true);
        const fetchedTasks = await fetchAllTasks();

        if (typeof fetchedTasks === "string") {
            if (fetchedTasks === "session expired") {
                alert("Session expired. Please login again.");
                navigate('/', { replace: true });
                return;
            } else if (fetchedTasks === "forbidden") {
                alert("Access forbidden. Please login with proper credentials.");
                navigate('/', { replace: true });
                return;
            } else if (fetchedTasks === 'bad request') {
                alert("Bad request. Please try again.");
                return;
            } else if (fetchedTasks === "server error") {
                alert("Server error. Please try again later.");
                navigate('/', { replace: true });
                return;
            }
        }

        setTimeout(() => {
            setTasks(fetchedTasks);
            setIsLoading(false);
        }, 3000);
    }

    const filteredTasks = useMemo(() => {
        return originalTasks.filter((task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedPriority ? task.priority === selectedPriority : true) &&
            (selectedStatus ? task.status === selectedStatus : true)
        );
    }, [originalTasks, searchTerm, selectedPriority, selectedStatus]);

    return (
        <div className={styles.home}>
            <UserContext.Provider value={{ user, setUser, fetchCurrentUser }}>
                <Sidebar />
            </UserContext.Provider>

            <div className={styles.content}>
                <div className={styles.usernameContainer}>
                    {user?.username && <span>👋 Welcome, {user.username}</span>}
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <FilterBar
                    selectedPriority={selectedPriority}
                    setSelectedPriority={setSelectedPriority}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />

                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <div className={styles.loader}></div>
                    </div>
                ) : (
                    <TaskContext.Provider value={{ fetchUserTasks }}>
                        <TaskList tasks={filteredTasks} setTasks={setTasks} />
                    </TaskContext.Provider>
                )}
            </div>

            <button className={styles.addTaskBtn} onClick={() => setIsModalOpen(true)}>
                +
            </button>

            {isModalOpen && (
                <AddTaskModal
                    onClose={() => setIsModalOpen(false)}
                    fetchUserTasks={fetchUserTasks}
                />
            )}
        </div>
    );
};

export default UserHome;
