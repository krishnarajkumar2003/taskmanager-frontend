import { useState } from 'react';
import SignIn from '../SignIn/SignIn';
import styles from '../AuthPage/AuthPage.module.css'
import SignUp from '../SignUp/SignUp';

function AuthPage() {
    const [isLogInSelected, setIsLogInSelected] = useState(true);
    console.log(isLogInSelected)
    return <>
        <div className={`${styles.authpage}`}>
            {isLogInSelected ? <SignIn setIsLogInSelected={setIsLogInSelected} /> : <SignUp setIsLogInSelected={setIsLogInSelected} />}
        </div>
    </>
}

export default AuthPage;