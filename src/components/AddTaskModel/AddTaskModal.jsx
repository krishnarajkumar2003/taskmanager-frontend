import { replace, useNavigate } from 'react-router-dom';
import { addTask } from '../../api/todoWebApi';
import styles from '../../pages/Home/UserHome.module.css';
import { useState } from 'react';

const AddTaskModal = ({ onClose, fetchUserTasks }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('WORK');
    const [priority, setPriority] = useState('LOW');
    const categories = ['WORK', 'PERSONAL', 'OTHERS'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.trim() === '') {
            alert('Title is required');
            return;
        }
        const newTask = { title, category, priority };
        const response = await addTask(newTask);
        if (response === 'success') {
            await fetchUserTasks();
            onClose();
        } else if (response === 'bad request') {
            alert("Please select correct category and priority")
        } else if (response === 'session expired') {
            onClose();
            alert("Session expired please re-login");
            navigate('/', { replace: true })
        } else if (response === "server error") {
            alert("Something went wrong please try again later");
        } else {
            console.log("AIYO")
        }
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
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
