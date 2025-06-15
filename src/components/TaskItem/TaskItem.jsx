import { useContext, useState } from 'react';
import style from '../../pages/Home/UserHome.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditTaskModal from '../EditTaskModel/EditTaskModal';
const TaskItem = ({ task, deleteMyTask }) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <div className={style.taskItem}>
                <div className={style.taskTitle}>Task Title : {task.title}</div>
                <div className={style.dueDate}>Due Date : {task.dueDate}</div>

                <div className={style.badgeGroup}>
                    <div className={`${style.category} ${style[task.category.toLowerCase()]}`}>
                        Category : {task.category}
                    </div>
                    <div className={`${style.priority} ${style[task.priority.toLowerCase()]}`}>
                        Priority : {task.priority}
                    </div>
                    <div className={`${style.status} ${task.status == "IN_PROGRESS" ? style.inprogress : style[task.status.toLowerCase()]}`}>
                        Status : {task.status == "IN_PROGRESS" ? "IN PROGRESS" : task.status}
                    </div>
                </div>

                <div className={style.icons}>
                    {task.status !== 'MISSED' && task.status !== "COMPLETED" && (
                        <FaEdit className={style.editIcon} onClick={() => setShowModal(true)} />
                    )}
                    <FaTrash onClick={() => deleteMyTask(task.id)} className={style.trashIcon} />
                </div>
            </div >

            {showModal && (
                <EditTaskModal
                    task={task}
                    onClose={() => setShowModal(false)}
                />
            )
            }
        </>
    );
};

export default TaskItem;
