import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TodoList from "./components/Todo/TodoList.tsx";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ProtectedRoute from "./utility/ProtectedRoute.tsx";
import Login from "./components/Auth/Login.tsx";
import './index.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/todos" replace />
    },
    { path: "/login", element: <Login /> },
    {
        element: <ProtectedRoute/>,
        children: [
            {path: '/todos', element: <TodoList/>},
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
