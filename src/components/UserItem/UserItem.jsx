import style from '../../pages/Home/UserHome.module.css';
import { FaTrash } from 'react-icons/fa';

const UserItem = ({ user, onDelete }) => {
    return (
        <div className={style.taskItem}>
            <div className={style.taskTitle}>Name : {user.username}</div>
            <div className={style.dueDate}>ID : {user.id}</div>
            <div className={style.dueDate}>Email : {user.email}</div>

            <div className={style.icons}>
                <FaTrash className={style.trashIcon} onClick={() => onDelete(user.id)} />
            </div>
        </div>
    );
};

export default UserItem;
