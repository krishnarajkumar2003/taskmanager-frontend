import style from '../../pages/Home/UserHome.module.css'


const FilterBar = ({ selectedPriority, setSelectedPriority, selectedStatus, setSelectedStatus }) => (
    <div className={style.filterWrapper}>
        <select
            className={style.filterSelect}
            onChange={(e) => setSelectedPriority(e.target.value)}
            value={selectedPriority}
        >
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
        </select>

        <select
            className={style.filterSelect}
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
        >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
        </select>
    </div>
);

export default FilterBar;
