import {useState} from "react";
import {login} from "../../services/api";
import {useNavigate} from "react-router-dom";
import TodoForm from "../Todo/TodoForm.tsx";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            login({email, password});
            setError(null);
            navigate("/todos", {replace: true});
        } catch (error) {
            setError('Failed to fetch todos');
        } finally {
            setLoading(false);
        }

    }
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>
                    <div className="flex flex-col w-full mb-6">
                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                                       className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                       className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <button type="submit"
                                    className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;