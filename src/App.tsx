/* eslint-disable react/react-in-jsx-scope */

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
import Profile from "./pages/common/Profile";
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
import UnderConstrution from "./components/public/common/UnderConstruction";
import CoursesList from "./pages/instructor/courses/CoursesList";
import CreateCourse from "./pages/instructor/courses/CreateCourse";
import AddLesson from "./pages/instructor/courses/AddLesson";
import { SkeletonTheme } from "react-loading-skeleton";
import EditCourse from "./pages/instructor/courses/EditCourse";
import EditLesson from "./pages/instructor/courses/EditLesson";
import Course from "./pages/public/Course";
import CourseDetails from "./pages/public/CourseDetails";
import Page404 from "./components/public/common/Page404";
import Chat from "./pages/admin/chat/Chat";
import EnrollmentList from "./pages/student/enrollment/EnrollmentList";
import EnrollmentListDetail from "./pages/student/enrollment/EnrollmentListDetail";
import CoursePaymentSuccess from "./pages/student/payment/CoursePaymentSuccess";
import CoursePaymentFailed from "./pages/student/payment/CoursePaymentFailed";
import StudentProfile from "./pages/student/settings/StudentProfile";
import CourseListA from "./pages/admin/course/CourseListA";
import Analytics from "./pages/instructor/analytics/Analytics";
import Transactions from "./pages/admin/transactions/Transactions";
import MentorGrid from "./pages/public/mentor/MentorGrid";
import MentorDetails from "./pages/public/mentor/MentorDetails";
import VideoList from "./pages/public/VideoList";
import SingleVideo from "./pages/public/SingleVideo";
import VideoUpload from "./pages/public/VideoUpload";
import Dashboard from "./pages/instructor/overview/dashboard";
import DashboardStudent from "./pages/student/overview/DashboardStudent";
import AdminDashboard from "./pages/admin/overview/AdminDashboard";
import AssessmentsAdmin from "./pages/admin/assessments/AssessmentsAdmin";
import ExamsList from "./pages/student/exams/Exams";
import InstructorExams from "./pages/instructor/assessments/InstructorExams";
import CreateNewExam from "./pages/instructor/assessments/CreateNewExam";
import InstructorProfile from "./pages/public/instructor/InstructorProfile";
import EditExam from "./pages/instructor/assessments/EditExam";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<NavLayout />}>
        <Route index element={<Home />} />
        <Route path="tech" element={<Tech />} />
        <Route path="course" element={<Course />} />
        <Route path="course-details/:id" element={<CourseDetails />} />
        <Route path="payment-success" element={<CoursePaymentSuccess />} />
        <Route path="payment-failed" element={<CoursePaymentFailed />} />
        <Route path="mentors" element={<MentorGrid />} />
        <Route path="mentor-profile" element={<InstructorProfile />} />

        <Route path="mentor-details/:id" element={<MentorDetails />} />

        {/* video test */}
        <Route path="video-upload" element={<VideoUpload />} />
        <Route path="video-list" element={<VideoList />} />
        <Route path="video-streaming/:id" element={<SingleVideo />} />

        <Route path="*" element={<Page404 />} />
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
        <Route path="overview" element={<DashboardStudent />} />
        <Route path="enrollments" element={<EnrollmentList />} />
        <Route path="enrollments/:id" element={<EnrollmentListDetail />} />
        <Route path="exams" element={<ExamsList />} />
        <Route path="chat" element={<UnderConstrution />} />
        <Route path="messages" element={<Chat />} />
        <Route path="settings" element={<StudentProfile />} />
      </Route>

      <Route
        path="instructor"
        element={
          <InstructorAuth>
            <InstructorLayout />
          </InstructorAuth>
        }
      >
        {/* <Route path="overview" element={<Dashboard />} /> */}
        <Route path="courses" element={<CoursesList />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="add-lesson/:id" element={<AddLesson />} />
        <Route path="edit-course/:id" element={<EditCourse />} />
        <Route path="edit-lesson/:id" element={<EditLesson />} />
        <Route path="exams" element={<InstructorExams />} />
        <Route path="create-exam" element={<CreateNewExam />} />
        <Route path="edit-exam/:id" element={<EditExam />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="messages" element={<Chat />} />
        <Route path="settings" element={<StudentProfile />} />
      </Route>

      <Route
        path="admin"
        element={
          <AdminAuth>
            <AdminLayout />
          </AdminAuth>
        }
      >
        <Route path="overview" element={<AdminDashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="edit-category/:id" element={<EditCategory />} />
        <Route path="courses" element={<CourseListA />} />
        <Route path="assessments" element={<AssessmentsAdmin />} />
        <Route path="profile" element={<Profile />} />
        <Route path="instructors" element={<InstructorList />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="messages" element={<Chat />} />
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
