import { Outlet } from "react-router-dom";
import Home from "../pages/client/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import NotFound from "../pages/NotFound.jsx";
import DefaultLayoutClient from "../layouts/DefaultLayoutClient.jsx";
import CourseDetail from "../pages/client/CourseDetail.jsx";

const clientRoutes = [
  {
    path: "/",
    element: (
      <DefaultLayoutClient>
        <Outlet />
      </DefaultLayoutClient>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "course/:id", element: <CourseDetail /> },
    ],
  },
];

export default clientRoutes;
