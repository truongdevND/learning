// src/routers/index.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import clientRoutes from "./clientRouter";
import adminRoutes from "./adminRouter";
import authRoutes from "./authRouter";

const router = createBrowserRouter([
  ...clientRoutes,
  ...adminRoutes,
  ...authRoutes,
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
