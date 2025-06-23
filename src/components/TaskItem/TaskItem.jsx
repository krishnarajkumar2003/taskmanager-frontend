import { useEffect, useState } from 'react';
import style from '../../pages/Home/UserHome.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditTaskModal, { EDIT_MODES } from '../EditTaskModel/EditTaskModal';
import { fetchAssignedProfile, fetchParticularProfile } from '../../api/todoWebApi';

const TaskItem = ({ task, deleteMyTask, user }) => {
    const [showModal, setShowModal] = useState(false);
    const [creatorDisplay, setCreatorDisplay] = useState('Loading...');
    const [creatorEmail, setCreatorEmail] = useState(null);
    const [assignedToDisplay, setAssignedToDisplay] = useState('Loading...');
    const [editMode, setEditMode] = useState(EDIT_MODES.LIMITED); // Default

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const creator = await fetchParticularProfile(task.createdBy);
                const assignedTo = await fetchAssignedProfile(task.assignedTo);

                const assignedUsername = assignedTo?.data?.username || "Unknown";
                setAssignedToDisplay(assignedUsername);

                // Determine display label and edit rights
                if (creator?.data?.email === user.email) {
                    setCreatorDisplay("YOU");
                    setEditMode(EDIT_MODES.OWNER);
                } else if (creator?.data?.role === "ROLE_ADMIN") {
                    setCreatorDisplay("ADMIN");
                    setEditMode(EDIT_MODES.LIMITED);
                } else if (creator?.data?.role === "ROLE_USER") {
                    setCreatorDisplay("USER");
                    setEditMode(EDIT_MODES.LIMITED);
                } else {
                    setCreatorDisplay(creator?.data?.name || "Unknown");
                    setEditMode(EDIT_MODES.LIMITED);
                }

                setCreatorEmail(creator?.data?.email);
            } catch (err) {
                console.error("Error fetching creator or assignedTo info:", err);
                setCreatorDisplay("Unknown");
                setAssignedToDisplay("Unknown");
                setEditMode(EDIT_MODES.LIMITED);
            }
        };

        fetchUsers();
    }, [task.createdBy, task.assignedTo, user]);

    return (
        <>
            <div className={style.taskItem}>
                <div className={style.taskTitle}>Task Title: {task.title}</div>
                <div className={style.taskDescription}>Task description: {task.description}</div>
                <div className={style.dueDate}>Due Date: {task.dueDate}</div>
                <div className={style.dueDate}>Created By: {creatorDisplay}</div>
                <div className={style.dueDate}>
                    Assigned To: {assignedToDisplay === user.username ? "YOU" : assignedToDisplay}
                </div>

                <div className={style.badgeGroup}>
                    <div className={`${style.category} ${style[task.category.toLowerCase()]}`}>
                        Category: {task.category}
                    </div>
                    <div className={`${style.priority} ${style[task.priority.toLowerCase()]}`}>
                        Priority: {task.priority}
                    </div>
                    <div className={`${style.status} ${task.status === "IN_PROGRESS" ? style.inprogress : style[task.status.toLowerCase()]}`}>
                        Status: {task.status === "IN_PROGRESS" ? "IN PROGRESS" : task.status}
                    </div>
                </div>

                <div className={style.icons}>
                    {task.status !== "COMPLETED" && (
                        <FaEdit className={style.editIcon} onClick={() => setShowModal(true)} />
                    )}
                    {creatorEmail === user.email && (
                        <FaTrash onClick={() => deleteMyTask(task.id)} className={style.trashIcon} />
                    )}
                </div>
            </div>

            {showModal && (
                <EditTaskModal
                    task={task}
                    onClose={() => setShowModal(false)}
                    editMode={editMode}
                />
            )}
        </>
    );
};

export default TaskItem;