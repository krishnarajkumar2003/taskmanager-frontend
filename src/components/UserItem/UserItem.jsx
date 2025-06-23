import { useState } from 'react';
import style from '../../pages/Home/UserHome.module.css';
import { FaTrash } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import AssignTaskModal from '../AssignTaskModel/AssignTaskModel';
import { addTask } from '../../api/todoWebApi';
import { useNavigate } from 'react-router-dom';

const UserItem = ({ fetchApprovedUsers, user, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleAssignTask = async (task) => {
        const response = await addTask(task);
        if (response === 'success') {
            await fetchApprovedUsers();
        } else if (response === 'bad request') {
            alert("Please select correct category, priority, or status");
        } else if (response === 'session expired') {
            alert("Session expired, please re-login");
            navigate('/', { replace: true });
        } else {
            alert("Something went wrong, please try again later");
        }
        setShowModal(false);
    };

    return (
        <>
            <div className={style.taskItem}>
                <div className={style.taskTitle}>Name: {user.username}</div>
                <div className={style.dueDate}>ID: {user.id}</div>
                <div className={style.dueDate}>Email: {user.email}</div>

                {onDelete && (
                    <div className={style.icons}>
                        <FaTrash
                            className={style.trashIcon}
                            onClick={() => onDelete(user.id)}
                        />
                    </div>
                )}

                <button
                    className={style.assignBtn}
                    onClick={() => setShowModal(true)}
                >
                    Assign Task
                </button>

                {/* <button
                    className={style.assignBtn}
                    style={{
                        backgroundColor: '#28a745',
                        width: '150px',
                        height: '50px',
                        marginTop: '10px',
                        fontSize: '18px',
                        borderRadius: '30px',
                        color: '#fff',
                    }}
                    onClick={() => navigate(`/view-tasks`)}
                >
                    View Tasks
                </button> */}
            </div>

            {showModal &&
                createPortal(
                    <AssignTaskModal
                        user={user}
                        onClose={() => setShowModal(false)}
                        onAssign={handleAssignTask}
                    />,
                    document.getElementById('modal-root')
                )}
        </>
    );
}; ``

export default UserItem;