const BASE_URL = 'http://localhost:8080/api';

export const loginUser = async (credentials) => { // Log in API
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        console.log("LOGIN USER:", response)

        if (response.status === 401) return "login failed";

        const jsonData = await response.json();

        if (jsonData.statusCode === 200) {
            return jsonData;
        } else if (jsonData.statusCode === 400) {
            return "bad request";
        } else if (jsonData.statusCode === 500) {
            return "email not registered";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }

    } catch (error) {
        console.error("Login error:", error);
        return "server error";
    }
};


export const registerUser = async (credentials) => { // Sign up API
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const jsonData = await response.json();

        if (jsonData.statusCode === 201) {
            return jsonData;
        } else if (jsonData.statusCode === 400) {
            return "bad request";
        } else if (jsonData.statusCode === 409) {
            return "registration failed";
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }

    } catch (error) {
        console.error("Registration error:", error);
        return "server error";
    }
};


export const fetchAllTasks = async () => { // Get all tasks API
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/todo/user/tasks/task`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        console.log("JSONDATA:", jsonData)

        if (jsonData.statusCode === 200) {
            return jsonData.data;
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        console.error("Error inside fetchAllTasks:", error);
        return "Error inside fetchAllTasks";
    }
};

export const fetchParticularProfile = async (userId) => { // Fetch particular user profile API
    try {
        const token = localStorage.getItem("token");
        console.log("TOKEN in fetch user:", token)

        const response = await fetch(`${BASE_URL}/user/user-profile/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        console.log("GETTING USER PROFILE:", response.status)
        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        if (jsonData.statusCode === 200) {
            return jsonData;
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        return "Error inside fetching profile";
    }
};

export const fetchAssignedProfile = async (userId) => { // Fetch particular user profile API
    try {
        const token = localStorage.getItem("token");
        console.log("TOKEN in fetch user:", token)

        const response = await fetch(`${BASE_URL}/user/assignedUser/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        if (jsonData.statusCode === 200) {
            return jsonData;
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        return "Error inside fetching profile";
    }
};




export const addTask = async (task) => { // Add task API
    try {
        console.log("TASK:", task)
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/todo/user/tasks/task`, {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        if (jsonData.statusCode === 201) {
            return "success";
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        console.error("Error inside addTask:", error);
        return "Error inside addTask";
    }
};


export const updateTask = async (task, taskId) => { // Update task API
    console.log("YOU ARE EDITING THE TASK ID:", taskId)
    console.log("AND THE TASK IS:", task)
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/todo/user/tasks/task/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(task),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        if (jsonData.statusCode === 200) {
            return "success";
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        console.error("Error inside updateTask:", error);
        return "Error inside updateTask";
    }
};


export const deleteTask = async (taskId) => { // Delete task API
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/todo/user/tasks/task/${taskId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        if (jsonData.statusCode === 200) {
            return "success";
        } else if (jsonData.statusCode === 400) {
            return "bad request";
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        console.error("Error inside deleteTask:", error);
        return "Error inside deleteTask";
    }
};


export const fetchProfile = async () => { // Fetch user profile API
    try {
        const token = localStorage.getItem("token");
        console.log("TOKEN in fetch user:", token)
        const response = await fetch(`${BASE_URL}/user/user-profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        console.log("GETTING USER PROFILE:", response.status)
        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        console.log("FETED USER FOR ADD:", jsonData)

        if (jsonData.statusCode === 200) {
            return jsonData;
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        return "Error inside fetching profile";
    }
};


export const updateUserProfile = async (user) => { // Update user profile API
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/user/update-user-profile`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });
        console.log("PROFILE STATUS:", response.status)
        console.log("TOKEN in UPDATE user:", token)
        if (response.status === 400) return "bad request"
        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        if (jsonData.statusCode === 200) {
            if (jsonData.message === 'User email is updated')
                return 'success email is updated';
            return 'success'
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        return "Error while updating user";
    }
};


export const fetchAllUsers = async () => { // Fetch all user API
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/users`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });



        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();
        console.log("datafetch", jsonData);


        if (jsonData.statusCode === 200) {
            return jsonData.data;
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        console.error("Error inside fetchAllUsers:", error);
        return "Error inside fetchAllUsers";
    }
};


export const getUser = async (creatorId) => {
    try {

    } catch (error) {

    }
}


export const deleteUserById = async (userId) => {
    console.log("CUR USER ID:", userId) // Delete user by user id
    try {
        const token = localStorage.getItem("token");
        console.log("DELETING USER PER ID:", token)
        const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        if (jsonData.statusCode === 200) {
            return "success";
        } else if (jsonData.statusCode === 404) {
            return "user not found";
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        console.error("Error inside deleteUserById:", error);
        return "Error inside deleteUserById";
    }
};


export const approveWaitingUser = async (userId, role) => {
    try {
        console.log("ROLE OF THE USER:", role)
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/users/${userId}?role=${role}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        console.log("APPROVED:", jsonData.statusCode)

        if (jsonData.statusCode === 200) {
            return "success";
        } else if (jsonData.statusCode === 404) {
            return "user not found";
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        return "Error inside approving the user"
    }
}

export const rejectUser = async (userId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/users/reject-user/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        console.log("APPROVED:", jsonData.statusCode)

        if (jsonData.statusCode === 200) {
            return "success";
        } else if (jsonData.statusCode === 404) {
            return "user not found";
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        return "Error inside rejecting the user"
    }
}


export const assignTaskToUser = async (task, userId) => {
    console.log(task, userId)
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/users/add-task/${userId}`, {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });



        if (response.status === 401) return "session expired";
        if (response.status === 403) return "forbidden";

        const jsonData = await response.json();

        console.log("Respose for adding task by user:", jsonData.statusCode)

        if (jsonData.statusCode === 201) {
            return "success";
        } else if (jsonData.statusCode === 500) {
            return "server error";
        } else {
            console.log(`Unhandled statusCode: ${jsonData.statusCode}`);
            return `error: ${jsonData.statusCode}`;
        }
    } catch (error) {
        console.error("Error inside addTask:", error);
        return "Error inside addTask";
    }
}