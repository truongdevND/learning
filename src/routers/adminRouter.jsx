import { Outlet } from "react-router-dom";
import HomeAdmin from "../pages/admin/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import DefaultLayoutAdmin from "../layouts/DefaultLayoutAdmin.jsx";
import ProtectedRoute from "../components/ProtectedRoute";

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
    ],
  },
];

export default adminRoutes;
