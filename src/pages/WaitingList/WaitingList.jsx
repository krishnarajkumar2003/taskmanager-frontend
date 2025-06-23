import { useEffect, useState } from "react";
import { approveWaitingUser, fetchAllUsers, rejectUser } from '../../api/todoWebApi';
import { useNavigate } from "react-router-dom";
import styles from "./WaitingList.module.css";
import img from '../../assets/acc.png';

function WaitingList() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAllWaitingUsers();
            } catch (error) {
                alert("Unexpected error occurred");
                navigate('/', { replace: true });
            }
        };

        fetchData();
    }, []);

    async function getAllWaitingUsers() {
        try {
            setIsLoading(true);
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

            setUsers(response);
        } catch (error) {
            alert("Something went wrong. Please try again later...");
        } finally {
            setTimeout(() => setIsLoading(false), 2000);
        }
    }

    const handleRoleChange = (id, newRole) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === id ? { ...user, role: newRole } : user
            )
        );
    };

    const handleApprove = async (user) => {
        const response = await approveWaitingUser(user.id, user.role);

        if (response === 'success') {
            await getAllWaitingUsers();
        } else if (response === 'bad request') {
            alert("Invalid input. Please try again.");
        } else if (response === 'session expired') {
            alert("Session expired. Please login again.");
            navigate('/', { replace: true });
        } else if (response === 'server error') {
            alert("Server error. Please try again later.");
        } else if (response?.statusCode === 400) {
            alert(response.message);
        } else {
            alert("Unexpected error occurred.");
        }
    };

    const handleReject = async (id) => {
        const response = await rejectUser(id);
        console.log("DELETED RES:", response)
        if (response === 'success') {
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
        }
        else if (response === 'bad request') {
            alert("Invalid input. Please try again.");
        } else if (response === 'session expired') {
            alert("Session expired. Please login again.");
            navigate('/', { replace: true });
        } else if (response === 'server error') {
            alert("Server error. Please try again later.");
        } else if (response?.statusCode === 400) {
            alert(response.message);
        } else {
            alert("Unexpected error occurred.");
        }
    };

    const waitingUsers = users?.filter(user => user.accountStatus === "PENDING") || [];

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p className={styles.loadingText}>Loading...</p>
            </div>
        );
    }

    if (waitingUsers.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <img src={img} alt="No users" className={styles.emptyImage} />
                <p className={styles.emptyText}>All waiting list users are approved for login</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Registered Users Waiting List</div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {waitingUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>
                                    <select
                                        className={styles.select}
                                        value={user.role ?? "ROLE_USER"}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        <option value="ROLE_USER">USER</option>
                                        <option value="ROLE_ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={`${styles.button} ${styles.approve}`}
                                            onClick={() => handleApprove(user)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className={`${styles.button} ${styles.reject}`}
                                            onClick={() => handleReject(user.id)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WaitingList;
