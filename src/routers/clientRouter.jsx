import Home from "../pages/client/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import NotFound from "../pages/NotFound.jsx";
import DefaultLayoutClient from "../layouts/DefaultLayoutClient.jsx";
const clientRoutes = [
  {
    path: "/",
    element: (
      <DefaultLayoutClient>
        <Home />
      </DefaultLayoutClient>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <NotFound />,
  },
];

export default clientRoutes;
