import { Outlet } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import NotFound from "../pages/NotFound.jsx";
import ProtectedRoute from "../components/ProtectedRoute";
const authRoutes = [
  {
    path: "/",
    element: <Outlet />,
    errorElement: <NotFound />,
    children: [
      { 
        path: "login", 
        element: (
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "register", 
        element: (
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        ) 
      },
    ],
  },
];

export default authRoutes;
