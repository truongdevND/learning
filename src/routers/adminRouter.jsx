import { Outlet } from "react-router-dom";
import HomeAdmin from "../pages/admin/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import DefaultLayoutAdmin from "../layouts/DefaultLayoutAdmin.jsx";
import ProtectedRoute from "../components/ProtectedRoute";
import UserManager from "../pages/admin/UserManager.jsx";
import CourseManager from "../pages/admin/Course/CourseManager.jsx";
import LessionManager from "../pages/admin/LessionManager.jsx";


const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="Admin">
        <DefaultLayoutAdmin>
          <Outlet />
        </DefaultLayoutAdmin>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomeAdmin /> },
      {  path: "/admin/user",  element: <UserManager /> },
      {  path: "/admin/course",  element: <CourseManager /> },
      {  path: "/admin/lession",  element: <LessionManager /> },

    ],
  },
];

export default adminRoutes;
