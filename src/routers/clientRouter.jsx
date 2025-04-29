import { Outlet } from "react-router-dom";
import Home from "../pages/client/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import DefaultLayoutClient from "../layouts/DefaultLayoutClient.jsx";
import CourseDetail from "../pages/client/CourseDetail.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import LessonTest from "../pages/client/LessonTest.jsx";

const clientRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DefaultLayoutClient>
          <Outlet />
        </DefaultLayoutClient>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "course/:id", element: <CourseDetail />,
      },
      {
        path: "test/:testId", element: <LessonTest />,
      },
    ],
  },
];

export default clientRoutes;
