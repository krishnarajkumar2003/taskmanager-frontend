// components/modals/AssignTaskModal.jsx
import { useState } from 'react';
import styles from '../../pages/Home/UserHome.module.css';

const AssignTaskModal = ({ user, onClose, onAssign }) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'LOW',
        category: 'WORK',
        assignedTo: user.id
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task.title.trim()) {
            alert('Task title is required');
            return;
        }

        onAssign(task);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className={styles.heading}>Assign Task to {user.username}</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Task Name</label>
                    <input
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter task title"
                        required
                    />

                    <label>Description</label>
                    <input
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        placeholder="Enter task description"
                        required
                    />

                    <label>Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={task.dueDate}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />

                    <label>Priority</label>
                    <select
                        name="priority"
                        value={task.priority}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>

                    <label>Category</label>
                    <select
                        name="category"
                        value={task.category}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="WORK">Work</option>
                        <option value="PERSONAL">Personal</option>
                        <option value="OTHERS">Others</option>
                    </select>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.addBtn}>Assign Task</button>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignTaskModal;
