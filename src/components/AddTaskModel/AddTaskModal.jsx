import { useNavigate } from 'react-router-dom';
import { addTask } from '../../api/todoWebApi';
import styles from '../../pages/Home/UserHome.module.css';
import { useState } from 'react';

const AddTaskModal = ({ user, onClose, fetchUserTasks }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('WORK');
    const [priority, setPriority] = useState('LOW');
    const [status, setStatus] = useState('PENDING');
    const [dueDate, setDueDate] = useState('');
    const [userId] = useState(user.id); // assignedTo = current user

    const categories = ['WORK', 'PERSONAL', 'OTHERS'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];
    const statuses = ['PENDING', 'IN PROGRESS', 'COMPLETED'];

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title.trim() === '') {
            alert('Title is required');
            return;
        }

        if (description.trim() === '') {
            alert('Description is required');
            return;
        }

        if (!dueDate) {
            alert('Due date is required');
            return;
        }

        const finalStatus = status === 'IN PROGRESS' ? 'IN_PROGRESS' : status;

        const newTask = {
            title,
            description,
            category,
            priority,
            status: finalStatus,
            dueDate,
            assignedTo: userId
        };

        const response = await addTask(newTask);

        if (response === 'success') {
            await fetchUserTasks();
            onClose();
        } else if (response === 'bad request') {
            alert("Please select correct category, priority, or status");
        } else if (response === 'session expired') {
            onClose();
            alert("Session expired, please re-login");
            navigate('/', { replace: true });
        } else {
            alert("Something went wrong, please try again later");
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.heading}>Add New Task</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Enter task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                        required
                    />

                    <label>Description</label>
                    <input
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.input}
                        required
                    />

                    <label>Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={styles.input}
                        required
                    />

                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={styles.select}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <label>Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className={styles.select}
                    >
                        {priorities.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>

                    <label>Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={styles.select}
                    >
                        {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <div className={styles.buttonGroup}>
                        <button type='submit' className={styles.addBtn}>Add Task</button>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
