import React, { useMemo, useState } from 'react';

import styles from './ViewUsers.module.css'
import Sidebar from '../../components/SideBar/SideBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import UserList from '../../components/UserList/UserList';
import useFetchUsers from '../../customHook/useFetchUsers';
import { UserContext } from '../../contexts/contexts';

const ViewUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const {
        originalUsers,
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

    return (
        <div className={styles.assignBtn}>
            <UserContext.Provider value={{ user, currentUser }}>
                <Sidebar />
            </UserContext.Provider>

            <div className={styles.content}>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <div className={styles.loader}></div>
                    </div>
                ) : (
                    <UserList
                        users={filteredUsers}
                        fetchApprovedUsers={fetchApprovedUsers}
                        onDelete={null} // 🔒 No delete button for view-only
                    />
                )}
            </div>
        </div>
    );
};

export default ViewUsers;
