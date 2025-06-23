import { useEffect, useState } from 'react';
import { fetchProfile, fetchAllUsers } from '../api/todoWebApi';
import { useNavigate } from 'react-router-dom';

const useFetchUsers = () => {
    const [originalUsers, setOriginalUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState('');
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetchAllUsers();

            console.log("USE FETCH:", response)

            if (typeof response === 'string') {
                if (response === 'session expired') {
                    alert("Session expired. Please login again.");
                    navigate('/', { replace: true });
                    return;
                } else if (response === 'bad request') {
                    alert("Bad request. Please try again.");
                    return;
                } else if (response === 'server error') {
                    alert("Server error. Please try again later.");
                    return;
                }
            }

            setOriginalUsers(response);
            await fetchCurrentUser();

        } catch (error) {
            console.error('Error fetching users:', error);
            alert("Unexpected error occurred.");
            navigate('/', { replace: true });
        } finally {
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    const fetchCurrentUser = async () => {
        const response = await fetchProfile();
        if (response === 'forbidden') {
            alert("Access forbidden.");
            navigate('/', { replace: true });
        } else if (response.statusCode === 200) {
            const { email, username, role } = response.data;
            setUser({ email, username });
            setCurrentUser(role);
        } else if (response === 'bad request') {
            alert("Bad request. Please try again.");
        } else if (response === 'server error') {
            alert("Server error. Please try again later.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        originalUsers,
        isLoading,
        user,
        currentUser,
        fetchData
    };
};

export default useFetchUsers;
