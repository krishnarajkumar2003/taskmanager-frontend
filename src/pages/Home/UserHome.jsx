import { useEffect, useMemo, useState } from 'react';
import styles from './UserHome.module.css';
import FilterBar from '../../components/FilterBar/FilterBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import TaskList from '../../components/TaskList/TaskList';
import Sidebar from '../../components/SideBar/SideBar';
import { fetchAllTasks, fetchProfile } from '../../api/todoWebApi';
import { useNavigate } from 'react-router-dom';
import AddTaskModal from '../../components/AddTaskModel/AddTaskModal';
import { TaskContext, UserContext } from '../../contexts/contexts';

const UserHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [originalTasks, setTasks] = useState([]);
    const [currentUser, setCurrentUserRole] = useState('');
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
            const { id, email, username } = response.data;
            setUser({ id, email, username });
            setCurrentUserRole(() => response.data.role);
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
        return originalTasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;
            const matchesStatus = selectedStatus ? task.status === selectedStatus : true;
            const matchesDate = selectedDate ? task.dueDate === selectedDate : true;

            return matchesSearch && matchesPriority && matchesStatus && matchesDate;
        });
    }, [originalTasks, searchTerm, selectedPriority, selectedStatus, selectedDate]);

    return (
        <div className={styles.home}>
            <UserContext.Provider value={{ user, setUser, fetchCurrentUser, currentUser }}>
                <Sidebar />
            </UserContext.Provider>

            <div className={styles.content}>
                <div className={styles.usernameContainer}>
                    {user?.username && <span>👋 Welcome, {user.username}</span>}
                </div>

                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <div className={styles.filterBarWithButton}>
                    <div className={styles.filters}>
                        <FilterBar
                            selectedPriority={selectedPriority}
                            setSelectedPriority={setSelectedPriority}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                        />
                    </div>
                    <div className={styles.rightControls}>
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <button
                            className={styles.addTaskBtnInline}
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Add Task
                        </button>
                    </div>
                </div>


                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <div className={styles.loader}></div>
                    </div>
                ) : (
                    <TaskContext.Provider value={{ fetchUserTasks }}>
                        <TaskList tasks={filteredTasks} setTasks={setTasks} user={user} />
                    </TaskContext.Provider>
                )}
            </div>

            {isModalOpen && (
                <AddTaskModal
                    onClose={() => setIsModalOpen(false)}
                    fetchUserTasks={fetchUserTasks}
                    user={user}
                />
            )}
        </div>
    );
};

export default UserHome;
