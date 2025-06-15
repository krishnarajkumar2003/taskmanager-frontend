import style from '../../pages/Home/UserHome.module.css';

const SearchBar = ({ searchTerm, setSearchTerm }) => (
    <div className={style.searchWrapper}>

        <div className={style.searchInputContainer}>

            <input
                type="text"
                className={style.searchField}
                placeholder="🔎 Search tasks..."
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />

            {searchTerm && (
                <span
                    className={style.clearIcon}
                    onClick={() => setSearchTerm('')} 
                >
                    ❌
                </span>
            )}
        </div>
    </div>
);

export default SearchBar;
