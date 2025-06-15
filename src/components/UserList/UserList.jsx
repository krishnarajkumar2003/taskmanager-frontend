import manImg from '../../assets/man.png';
import style from '../../pages/Home/UserHome.module.css';
import UserItem from '../UserItem/UserItem';

function UserList({ users, onDelete }) {
    return (
        <div className={style.taskList}>
            {
                users.length > 0 ? (
                    users.map((user) => (
                        <UserItem key={user.id} user={user} onDelete={onDelete} />
                    ))
                ) : (
                    <>
                        <img src={manImg} alt="No users found" className={style.noTaskFound} />
                        <p className={style.noTaskFound} style={{ color: 'white' }}>No users found</p>
                    </>
                )
            }
        </div>
    );
}

export default UserList;
