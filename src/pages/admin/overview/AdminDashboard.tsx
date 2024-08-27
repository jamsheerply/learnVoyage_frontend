import React, { useEffect, useState } from "react";

import { Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/shadcn/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { readTotalRevenueApi } from "@/store/api/PaymentApi";
import { readTotalStudnetsAndInstructorsApi } from "@/store/api/AuthApi";
import { EnrollmentEntity } from "@/types/enrollmentEntity";
import {
  readCoursesStatusApi,
  readTopCoursesApi,
} from "@/store/api/EnrollmentApi";
import { userEntity } from "@/types/userEntity";
import { getAllInstructorsApi } from "@/store/api/InstructorApi";
import { ICourse } from "@/types/course.entity";

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<{ name: string; value: number }[]>([]);
  const [topCourses, setTopCourses] = useState<ICourse[]>([]);
  const [courseStatus, setCourseStatus] = useState<EnrollmentEntity[]>([]);
  const [topMentors, setTopMentors] = useState<userEntity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalRevenue = await readTotalRevenueApi();
        setMetrics((prev) => [
          ...prev,
          { name: "Total Revenue", value: totalRevenue.data.data.totalRevenue },
        ]);

        const totalStudentsAndInstructors =
          await readTotalStudnetsAndInstructorsApi();

        setMetrics((prev) => [
          ...prev,
          {
            name: "Total students",
            value: totalStudentsAndInstructors.data.data.totalStudents,
          },
          {
            name: "Total Instructors",
            value: totalStudentsAndInstructors.data.data.totalIntructors,
          },
        ]);

        const topCourse = await readTopCoursesApi();
        setTopCourses(topCourse.data.data);

        const courseStatusData = await readCoursesStatusApi();
        setCourseStatus(courseStatusData.data.data);

        const topMentorsData = await getAllInstructorsApi();

        setTopMentors(topMentorsData.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("topCourses", topCourses);
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.length > 0 &&
          metrics.map((metric) => (
            <Card key={metric.name} className="p-4">
              <h3 className="text-sm font-medium text-green-600">
                {metric.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold">{metric.value}</span>
                <div className="w-20 h-10 bg-green-100 rounded-md flex justify-center items-center text-green-500">
                  <TrendingUp size={26} />
                </div>
              </div>
            </Card>
          ))}
      </div>

      {topCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCourses.map((course, index) => (
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

      <div>
        <h2 className="text-xl font-semibold mb-4">Course Status</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sale</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Earning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseStatus.map((course, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {course.courseName}
                  </TableCell>
                  <TableCell>{course.categoryName}</TableCell>
                  <TableCell>{course.totalEnrollments}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {course.rating
                        ? course.rating.toFixed(1)
                        : (Math.random() * 3 + 2).toFixed(1)}
                      <Star className="w-4 h-4 text-yellow-400 ml-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    ₹
                    {course.totalRevenue.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Top Mentors</h2>
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
    </div>
  );
};

export default AdminDashboard;
