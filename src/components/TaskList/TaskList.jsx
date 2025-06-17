import manImg from '../../assets/man.png';
import TaskItem from '../TaskItem/TaskItem';
import style from '../../pages/Home/UserHome.module.css';
import { deleteTask } from '../../api/todoWebApi';

function    TaskList({ tasks, setTasks }) {
    async function deleteMyTask(taskId) {
        const response = await deleteTask(taskId);
        if (typeof response === "string") {
            if (response === 'success') {
                const mytasks = tasks.filter((task) => task.id !== taskId);
                setTasks(mytasks);
            } else if (response === 'session expired') {
                alert("Session expired please re-login");
                navigate('/', { replace: true })
            }
        }
    }
    return (<>< div className={style.taskList} >
        {
            tasks.length > 0 ? (
                tasks.map((task) => <TaskItem deleteMyTask={deleteMyTask} key={task.id} task={task} />)
            ) : (
                <>
                    <img src={manImg} alt="No task found" className={style.noTaskFound} />
                    <p className={style.noTaskFound} style={{ color: 'white' }}>No task found</p>
                </>
            )
        }
    </div ></>);
}
export default TaskList;
