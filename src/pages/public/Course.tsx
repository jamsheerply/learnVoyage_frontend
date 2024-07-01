import { Filter } from "lucide-react";
import CourseCard from "../../components/public/CourseCard";
import CourseFilter from "../../components/public/CourseFilter";

const Course = () => {
  return (
    <div className="flex w-[88%] min-h-screen mx-auto py-2">
      <div className="  w-full ">
        <div className=" flex lg:justify-start justify-between w-full ">
          <h1 className="">All Courses</h1>
          <span className="lg:hidden block">
            <Filter />
          </span>
        </div>
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </div>
      <div className=" w-96 lg:block hidden">
        <CourseFilter />
        <CourseFilter />
        <CourseFilter />
      </div>
    </div>
  );
};

export default Course;
