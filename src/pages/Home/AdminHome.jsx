import { useMemo, useState } from 'react';
import styles from './AdminHome.module.css';
import Sidebar from '../../components/SideBar/SideBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import UserList from '../../components/UserList/UserList';
import { useNavigate } from 'react-router-dom';
import { deleteUserById } from '../../api/todoWebApi';
import useFetchUsers from '../../customHook/useFetchUsers'
import { UserContext } from '../../contexts/contexts';

const AdminHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const {
        originalUsers,
        setOriginalUsers,
        user,
        currentUser,
        isLoading,
        fetchData: fetchApprovedUsers
    } = useFetchUsers();

    const filteredUsers = useMemo(() => {
        return originalUsers
            .filter(user => user.accountStatus?.toUpperCase() === "APPROVED")
            .filter(user =>
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
            <UserContext.Provider value={{ user, currentUser }}>
                <Sidebar />
            </UserContext.Provider>

            <div className={styles.content}>
                <div className={styles.adminContainer}>
                    {user?.username && <span>👋 Welcome, {user.username}</span>}
                </div>

                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <div className={styles.loader}></div>
                    </div>
                ) : (
                    <UserList
                        fetchApprovedUsers={fetchApprovedUsers}
                        users={filteredUsers}
                        onDelete={handleDelete} // delete only in Admin view
                    />
                )}
            </div>
        </div>
    );
};

export default AdminHome;
