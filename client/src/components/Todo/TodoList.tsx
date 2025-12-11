import TodoForm from "./TodoForm.tsx";
import {useEffect, useState} from "react";
import * as api from "../../services/api";
import {useNavigate} from "react-router-dom";

function TodoList() {
    type Todo = {
        id: string;          // or number if your API uses numbers
        title: string;
        description: string;
        done: boolean;
    };

    const navigate = useNavigate();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Edit States
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        fetchTodos(page)
    }, [page]);

    const fetchTodos = async (pageToLoad: number) => {
        try {
            const data = await api.getTodos(pageToLoad);
            setTodos(data.data);
            setPage(data.current_page ?? pageToLoad);
            setLastPage(data.last_page ?? 1);

            setError(null);
        } catch (error) {
            setError('Failed to fetch todos');
        } finally {
            setLoading(false);
        }
    }

    const toggleTodoStatus = async (id: string) => {
        try {
            await api.toggleDone(id);
            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === id ? {...todo, done: !todo.done} : todo
                )
            );
        } catch (error) {
            setError('Failed to update todo status');
        }
    };

    const startEdit = (todo: Todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
        setEditDescription(todo.description ?? "");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
    };

    const handleUpdate = async (id: string) => {
        try {
            const payload = {
                title: editTitle.trim(),
                description: editDescription.trim(),
            };

            // call backend
            const updated = await api.updateTodo(id, payload);

            // update local state
            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === id
                        ? {
                            ...todo,
                            title: updated.title ?? payload.title,
                            description: updated.description ?? payload.description,
                        }
                        : todo
                )
            );

            cancelEdit();
            setError(null);
        } catch (error) {
            setError("Failed to update todo");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.deleteTodos(id);
            setTodos((prevTodos) =>
                prevTodos.filter((todo) => todo.id !== id)
            );
        } catch (error) {
            setError('Failed to update todo status');
        }
    }

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">TODO App</h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>

                    {loading && <div>Loading...</div>}
                    <TodoForm fetchTodos={fetchTodos}/>

                    {error && <p style={{color: "red"}}>{error}</p>}
                    <ul className="space-y-2">
                        {
                            todos.map((todo) => {
                                const isEditing = editingId === todo.id;

                                return (
                                    <li key={todo.id}
                                        className="border p-4 rounded-lg shadow flex items-center space-x-4 bg-slate-100">
                                        <input type="checkbox" checked={todo.done}
                                               onChange={() => toggleTodoStatus(todo.id)}
                                               className="mr-2 h-5 w-5 text-green-500"/>
                                        <div className="flex flex-col flex-grow">
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        className="flex-grow border rounded px-2 py-1"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                    />
                                                    <textarea
                                                        className="w-full border rounded px-2 py-1"
                                                        rows={3}
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <span
                                                        className={`font-bold capitalize ${
                                                            todo.done ? "line-through text-gray-400" : "text-gray-800"
                                                        }`}>
                                                      {todo.title}
                                                    </span>
                                                    <p
                                                        className={`text-sm ${
                                                            todo.done ? "line-through text-gray-400" : "text-gray-800"
                                                        }`}>
                                                        {todo.description}
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <>
                                                <button
                                                    className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                                                    onClick={() => handleUpdate(todo.id)}
                                                    disabled={!editTitle.trim()}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                                                    onClick={cancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="border-none p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                                                    onClick={() => startEdit(todo)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="ml-2 border-none p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                                    onClick={() => handleDelete(todo.id)}>
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </li>
                                );
                            })
                        }
                    </ul>

                    <div className="mt-4 flex items-center justify-center space-x-3">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page
                            <span className="font-semibold">{page}</span> of{" "}
                            <span className="font-semibold">{lastPage}</span>
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                            disabled={page >= lastPage}
                            className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TodoList;