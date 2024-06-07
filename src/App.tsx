import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import NavLayout from "./layouts/NavLayout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/signin";
import Otp from "./pages/Otp";
import StudentLayout from "./layouts/StudentLayout";
import Profile from "./pages/Profile";
import AdminLayout from "./layouts/AdminLayout";
import StudentAuth from "./components/Hoc/StudentAuth";
import InstructorAuth from "./components/Hoc/InstructorAuth";
import InstructorLayout from "./layouts/InstructorLayout";
import AdminAuth from "./components/Hoc/AdminAuth";
import Tech from "./pages/Tech";
import InstructorSignup from "./pages/InstructorSignup";
import InstructorList from "./pages/InstructorList";
import Categories from "./pages/Categories";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<NavLayout />}>
        <Route index element={<Home />} />
        <Route path="tech" element={<Tech />} />
      </Route>

      <Route path="student-auth">
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
        <Route path="otp" element={<Otp />} />
      </Route>
      <Route path="instructor-auth">
        <Route path="signup" element={<InstructorSignup />} />
      </Route>

      <Route
        path="student"
        element={
          <StudentAuth>
            <StudentLayout />
          </StudentAuth>
        }
      >
        <Route path="overview" />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="instructor"
        element={
          <InstructorAuth>
            <InstructorLayout />
          </InstructorAuth>
        }
      >
        <Route path="overview" />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="admin"
        element={
          <AdminAuth>
            <AdminLayout />
          </AdminAuth>
        }
      >
        <Route path="overview" />
        <Route path="categories" />
        <Route path="profile" element={<Profile />} />
        <Route path="instructors" element={<InstructorList />} />
      </Route>
    </Route>
  )
);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
