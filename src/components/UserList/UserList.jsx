import manImg from '../../assets/man.png';
import style from '../../pages/Home/UserHome.module.css';
import UserItem from '../UserItem/UserItem';

function UserList({ fetchApprovedUsers, users, onDelete }) {
    return (
        <div>
            {users.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                    <img src={manImg} alt="No task found" className={style.noTaskFound} />
                    <p style={{ color: 'white' }}>No users found</p>
                </div>
            ) : (
                <div className={style.taskList}>
                    {users.map(user => (
                        <UserItem key={user.id} user={user} fetchApprovedUsers={fetchApprovedUsers} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserList;
