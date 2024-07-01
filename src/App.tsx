import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import NavLayout from "./layouts/NavLayout";
import Home from "./pages/public/Home";
import Signup from "./pages/public/Signup";
import Signin from "./pages/public/Signin";
import Otp from "./pages/public/Otp";
import StudentLayout from "./layouts/StudentLayout";
import Profile from "./pages/Profile";
import AdminLayout from "./layouts/AdminLayout";
import StudentAuth from "./components/Hoc/StudentAuth";
import InstructorAuth from "./components/Hoc/InstructorAuth";
import InstructorLayout from "./layouts/InstructorLayout";
import AdminAuth from "./components/Hoc/AdminAuth";
import Tech from "./pages/public/Tech";
import InstructorSignup from "./pages/public/InstructorSignup";
import InstructorList from "./pages/admin/instructor/InstructorList";
import Categories from "./pages/admin/category/Categories";
import { Toaster } from "react-hot-toast";
import AddCategory from "./pages/admin/category/AddCategory";
import EditCategory from "./pages/admin/category/EditCategory";
import Warning from "./components/SomeWentWrong";
import UnderConstrution from "./components/UnderConstruction";
import CoursesList from "./pages/instructor/courses/CoursesList";
import CreateCourse from "./pages/instructor/courses/CreateCourse";
import { AddLesson } from "./pages/instructor/courses/AddLesson";
import { SkeletonTheme } from "react-loading-skeleton";
import EditCourse from "./pages/instructor/courses/EditCourse";
import EditLesson from "./pages/instructor/courses/EditLesson";
import Course from "./pages/public/Course";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<NavLayout />}>
        <Route index element={<Home />} />
        <Route path="tech" element={<Tech />} />
        <Route path="course" element={<Course />} />
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
        <Route path="settings" element={<Profile />} />
      </Route>

      <Route
        path="instructor"
        element={
          <InstructorAuth>
            <InstructorLayout />
          </InstructorAuth>
        }
      >
        <Route path="overview" element={<UnderConstrution />} />
        <Route path="courses" element={<CoursesList />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="add-lesson/:id" element={<AddLesson />} />
        <Route path="edit-course/:id" element={<EditCourse />} />
        <Route path="edit-lesson/:id" element={<EditLesson />} />
        <Route path="enrollments" element={<UnderConstrution />} />
        <Route path="exams" element={<UnderConstrution />} />
        <Route path="messages" element={<UnderConstrution />} />
        <Route path="settings" element={<Profile />} />
      </Route>

      <Route
        path="admin"
        element={
          <AdminAuth>
            <AdminLayout />
          </AdminAuth>
        }
      >
        <Route path="overview" element={<UnderConstrution />} />
        <Route path="categories" element={<Categories />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="edit-category/:id" element={<EditCategory />} />
        <Route path="profile" element={<Profile />} />
        <Route path="instructors" element={<InstructorList />} />
        <Route path="helloworld" element={<Warning />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <RouterProvider router={router} />
        <Toaster />
      </SkeletonTheme>
    </>
  );
};

export default App;
