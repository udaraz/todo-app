import {useState} from "react";
import {createTodo} from "../../services/api";

function TodoForm({fetchTodos}) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        setMessage("");
        setError("");

        e.preventDefault();

        const payload = {
            title: title.trim(),
            description: description.trim(),
        };

        try {
            setSubmitting(true);
            const response = await createTodo(payload);

            if (response.ok) {
                await fetchTodos();
                setMessage("Todo created successfully");
            } else {
                setError("Something went wrong while creating the todo.");
            }
        } catch (err) {
            setError(err.message || "Failed to create todo.");
        } finally {
            setSubmitting(false);
        }
        setTitle("");
        setDescription("");
    };

    return (
        <div className="mb-6">
            <form onSubmit={handleSubmit} style={{display: "grid", gap: 10}}
                  className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow">
                <label className="text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {message && (
                    <p className="mb-2 text-sm text-green-600">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="mb-2 text-sm text-red-600">
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={!title.trim() || submitting}
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm
                     font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Adding..." : "Add Todo"}
                </button>
            </form>
        </div>
    );
}

export default TodoForm;