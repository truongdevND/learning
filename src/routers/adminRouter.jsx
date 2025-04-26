import { Outlet } from "react-router-dom";
import HomeAdmin from "../pages/admin/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import DefaultLayoutAdmin from "../layouts/DefaultLayoutAdmin.jsx";

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <DefaultLayoutAdmin>
        <Outlet />
      </DefaultLayoutAdmin>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomeAdmin /> },
    ],
  },
];

export default adminRoutes;
