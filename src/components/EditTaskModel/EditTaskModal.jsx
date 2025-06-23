import { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import style from '../../pages/Home/UserHome.module.css';
import { updateTask } from '../../api/todoWebApi';
import { TaskContext } from '../../contexts/contexts';
import { useNavigate } from 'react-router-dom';

export const EDIT_MODES = {
    OWNER: 'owner-edit',
    LIMITED: 'shared-edit'
};

const EditTaskModal = ({ task, onClose, editMode }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [category, setCategory] = useState(task.category);
    const [priority, setPriority] = useState(task.priority);
    const [status, setStatus] = useState(task.status);
    const [dueDate, setDueDate] = useState(task.dueDate);

    const { fetchUserTasks } = useContext(TaskContext);
    const navigate = useNavigate();

    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    const categories = ['WORK', 'PERSONAL', 'OTHERS'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];

    async function updateMyTask() {
        const updatedTask =
            editMode === EDIT_MODES.OWNER
                ? { title, description, category, priority, status, dueDate }
                : { status };

        const response = await updateTask(updatedTask, task.id);

        if (response === 'success') {
            await fetchUserTasks();
            onClose();
        } else if (response === 'bad request') {
            alert('Invalid input. Please try again.');
        } else if (response === 'session expired') {
            alert('Session expired. Please login again.');
            navigate('/', { replace: true });
        } else if (response === 'server error') {
            alert('Server error. Please try again later.');
        } else if (response.statusCode === 400) {
            alert(response.message);
        } else {
            alert('Unexpected error occurred.');
        }
    }

    const modalContent = (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <h2>Edit Task</h2>

                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={editMode !== EDIT_MODES.OWNER}
                />

                <label>Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={editMode !== EDIT_MODES.OWNER}
                />

                <label>Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={editMode !== EDIT_MODES.OWNER}
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <label>Priority</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={editMode !== EDIT_MODES.OWNER}
                >
                    {priorities.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>

                <label>Due Date</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={editMode !== EDIT_MODES.OWNER}
                />

                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s === 'IN_PROGRESS' ? 'IN PROGRESS' : s}
                        </option>
                    ))}
                </select>

                <div className={style.buttonGroup}>
                    <button onClick={updateMyTask}>
                        {editMode === EDIT_MODES.OWNER ? 'Update Task' : 'Update Status'}
                    </button>
                    <button onClick={onClose} className={style.cancelBtn}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default EditTaskModal;
