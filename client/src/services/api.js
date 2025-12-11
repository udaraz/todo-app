const API_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = 'auth_token';

export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (data.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token);
    }
    return response;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem(TOKEN_KEY);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getTodos = async (page = 1) => {
    const response = await fetch(`${API_URL}/v1/todos?page=${page}&limit=5`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        let msg = `Request failed (${response.status})`;
        try {
            const body = await response.json();
            console.log(body);
            msg = body.message || body.error || msg;
        } catch {}
        throw new Error(msg);
    }

    return response.json();
}

export const createTodo = async (data) => {
    return await fetch(`${API_URL}/v1/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    });
}

export const updateTodo = async (id, data) => {
    return await fetch(`${API_URL}/v1/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    })
}

export const toggleDone = async (id) => {
    return await fetch(`${API_URL}/v1/${id}/done`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
}

export const deleteTodos = async (id) => {
    return await fetch(`${API_URL}/v1/todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
}

