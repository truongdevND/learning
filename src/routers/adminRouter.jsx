// src/routers/adminRouter.jsx
import HomeAdmin from "../pages/admin/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import DefaultLayoutAdmin from "../layouts/DefaultLayoutAdmin.jsx";

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <DefaultLayoutAdmin>
        <HomeAdmin />
      </DefaultLayoutAdmin>
    ),
    errorElement: <NotFound />,
  },
];

export default adminRoutes;
