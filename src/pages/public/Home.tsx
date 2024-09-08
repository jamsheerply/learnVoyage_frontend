import { Search, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import homeImg from "../../assets/homePage2.png";
import Footer from "@/components/public/common/Footer";
import { userEntity } from "@/types/userEntity";
import { readTopCoursesApi } from "@/store/api/EnrollmentApi";
import { getAllInstructorsApi } from "@/store/api/InstructorApi";
import { Card, CardContent } from "@/shadcn/ui/card";
import { ICourse } from "@/types/course.entity";

const Home: React.FC = () => {
  const [topCourses, setTopCourses] = useState<ICourse[]>([]);
  const [topMentors, setTopMentors] = useState<userEntity[]>([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const topCourse = await readTopCoursesApi();
        setTopCourses(topCourse.data.data);
        const topMentorsData = await getAllInstructorsApi();

        setTopMentors(topMentorsData.data.data);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div>
      {/* <hr /> */}
      {/* White space */}
      <div className="h-24 hidden lg:block"></div>

      <div className="lg:flex ">
        <div className=" lg:w-[50%]   lg:text-start lg:px-[100px] lg:bg-white px-[20px]">
          <h4 className="text-bold lg:text-lg text-green-600 py-4">
            Never Stop Learning
          </h4>
          <h1 className="font-extrabold lg:text-5xl my-4 ">
            Grow up your skills by online courses with LearnVoyage
          </h1>
          <p className="lg:py-4  text-bold">
            LearnVoyage is a Golbal training provider based across the India
            that specialises in acrredited and besspoke training coursed.We
            crush the barries togetting a degree
          </p>
          <div className="flex gap-3 lg:my-0 my-3">
            <input
              type="text"
              className="bg-gray-200 lg:p-2 lg:px-4  rounded-md"
            />
            <div className="flex bg-green-600 rounded-md px-2 ">
              <span className="flex items-center">
                <Search />
              </span>
              <button className="p-2 mx-2">search</button>
            </div>
          </div>
        </div>
        <div className="  lg:w-[50%] text-center lg:py-2 lg:my-0 my-3">
          <img src={homeImg} />
        </div>
      </div>
      <div className="w-full py-10 2xl:py-20 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-extrabold text-sm lg:text-2xl">
            Search among <span className="primary-text">58340</span> courses and
          </h2>
          <h2 className="font-extrabold text-sm lg:text-2xl">
            find your favorite course
          </h2>
        </div>
        <div className="flex items-center gap-2 lg:flex-row flex-col">
          <div className="flex items-center justify-center px-2 py-1 secondary-bg rounded">
            <div className="flex items-center justify-between gap-4">
              <button className="px-4 py-2 rounded primary-bg text-xs font-normal text-white">
                categories
              </button>
              <input
                placeholder="Search anything..."
                type="text"
                className="text-xs lg:text-sm outline-none lg:min-w-96 bg-transparent"
              />
            </div>
          </div>
          <span className="bg-white text-xs font-medium">
            Or view the following courses...
          </span>
        </div>
      </div>
      <section className="bg-white px-12 lg:px-24">
        <h2 className="font-extrabold text-lg sm:text-2xl mb-6">
          Top <span className="primary-text">Courses</span>
        </h2>
        {topCourses.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCourses.slice(0, 3).map((course, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-40 bg-green-600 overflow-hidden">
                    <img
                      src={course.courseThumbnailUrl}
                      alt={course.courseName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {course.courseName}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Lesson: {course.lessons.length}</span>
                      <span>Student: {course.totalEnrollments}</span>
                      <span>{course.level || "Medium"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <button className="px-4 py-2 bg-black text-white rounded-md text-sm">
                        Details
                      </button>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 3 ? "text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
      <section className="bg-white px-12 lg:px-24 py-4">
        <h2 className="font-extrabold text-lg sm:text-2xl mb-6">
          Top <span className="primary-text">Instructors</span>
        </h2>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {topMentors.map((mentor, index) => (
              <Card key={index} className="overflow-hidden">
                <img
                  src={mentor.profile.avatar}
                  alt={`${mentor.firstName}${mentor.lastName}`}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{`${mentor.firstName} ${mentor.lastName}`}</h3>
                  <p className="text-sm text-gray-500">
                    {mentor.profession || "Instructor"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
