import {
  Bell,
  BookOpen,
  BookText,
  Home,
  MessageCircleMore,
  NotebookPen,
  Settings,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import profileImg from "../assets/profilePic.svg";

const AdminLayout = () => {
  const navigate = useNavigate();
  const handleInstructors = () => {
    navigate("/admin/instructors", { replace: true });
  };
  const handleOverview = () => {
    navigate("/admin/overview", { replace: true });
  };
  return (
    <>
      <div className="flex h-[687px]">
        <div className="bg-green-100 w-[250px] flex flex-col">
          <div className="p-4">
            <div className="text-green-600 text-4xl font-semibold text-center my-6">
              Admin
            </div>
          </div>
          <nav className="flex flex-col items-center justify-center ">
            <p
              className=" px-5 mt-[70px] py-2 text-gray-600 bg-green-600 rounded-lg w-[175px] h-[45px] flex gap-1 cursor-pointer"
              onClick={handleOverview}
            >
              <Home />
              Overview
            </p>
            <p className=" px-5 mt-[25px] py-2 bg-white text-gray-500 rounded-lg w-[175px] h-[45px] flex gap-1 cursor-pointer">
              <BookOpen />
              Enrollments
            </p>
            <p className=" px-5 mt-[25px] py-2 bg-white text-gray-500 rounded-lg w-[175px] h-[45px] flex gap-1 cursor-pointer">
              <BookText />
              Exams
            </p>
            <p
              className=" px-5 mt-[25px] py-2 bg-white text-gray-500 rounded-lg w-[175px] h-[45px] flex gap-1 cursor-pointer"
              onClick={handleInstructors}
            >
              <NotebookPen />
              Instructors
            </p>
            <p className=" px-5 mt-[25px] py-2 bg-white text-gray-500 rounded-lg w-[175px] h-[45px] flex gap-1 cursor-pointer">
              <MessageCircleMore />
              Messages
            </p>
            <p className=" px-5 mt-[25px] py-2 bg-white text-gray-500  rounded-lg w-[175px] h-[45px] flex gap-1 cursor-pointer">
              <Settings />
              Settings
            </p>
          </nav>
        </div>
        <div className="flex-1">
          <nav className="text-black py-4 px-6 flex gap-5 justify-end items-center h-[100px]">
            <div className="text-base font-semibold  h-full flex gap-2 items-center">
              <div className=" flex items-center justify-center bg-green-200 rounded-lg ">
                <img src={profileImg} className="w-12 h-full  " />
              </div>
              <div>
                <div>jamsheer</div>
                <div>ui & ux designer</div>
              </div>
            </div>
            <div className="lucideBell bg-green-100 flex items-center p-4 rounded-md ">
              <Bell />
            </div>
          </nav>
          <hr className="h-px my-2 bg-gray-400 border-0" />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
