import { Outlet } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import NotFound from "../pages/NotFound.jsx";

const authRoutes = [
  {
    path: "/",
    element: <Outlet />,
    errorElement: <NotFound />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
];

export default authRoutes;
