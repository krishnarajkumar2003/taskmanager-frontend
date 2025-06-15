import { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import style from '../../pages/Home/UserHome.module.css';
import { updateTask } from '../../api/todoWebApi';
import { TaskContext } from '../../contexts/TaskContext'; 
import { useNavigate } from 'react-router-dom';

const EditTaskModal = ({ task, onClose }) => {
    const [title, setTitle] = useState(task.title);
    const [category, setCategory] = useState(task.category);
    const [priority, setPriority] = useState(task.priority);
    const [status, setStatus] = useState(task.status);
    const { fetchUserTasks } = useContext(TaskContext);
    const navigate = useNavigate();

    const categories = ['WORK', 'PERSONAL', 'OTHERS'];
    const priorities = ['HIGH', 'MEDIUM', 'LOW'];
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

    async function updateMyTask() {
        if (!title.trim()) {
            alert("Task title cannot be empty.");
            return;
        }

        const updatedTask = { title, category, priority, status };
        const response = await updateTask(updatedTask, task.id);

        if (response === 'success') {
            await fetchUserTasks();
            onClose();
        } else if (response === 'bad request') {
            alert("Invalid input. Please select valid category and priority.");
        } else if (response === 'session expired') {
            alert("Session expired. Please login again.");
            navigate('/', { replace: true });
        } else if (response === 'server error') {
            alert("Server error. Please try again later.");
        } else if (response.statusCode === 400) {
            alert(response.message);
        } else {
            alert("Unexpected error occurred.");
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
                />

                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <label>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    {priorities.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>

                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s === "IN_PROGRESS" ? "IN PROGRESS" : s}
                        </option>
                    ))}
                </select>

                <div className={style.buttonGroup}>
                    <button onClick={updateMyTask}>Update Task</button>
                    <button onClick={onClose} className={style.cancelBtn}>Cancel</button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default EditTaskModal;
