import React, { useEffect, useState } from "react";
import { Star, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { totalCourseApi } from "@/store/api/CourseApi";
import {
  topEnrollmentApi,
  totalEnrollmentsApi,
  totalRevenueApi,
} from "@/store/api/EnrollmentApi";

const Dashboard: React.FC = () => {
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalEnrollment, setTotalEnrollment] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [topEnrollment, setTopEnrollment] = useState<
    {
      courseName: number;
      numberOfEnrollments: number;
      numberOfComments: number | null;
      greatestRating: number | null;
      coursePrice: number;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalCoursesResponse = await totalCourseApi();
        setTotalCourses(totalCoursesResponse.data.data);
        const totalEnrollmentReponse = await totalEnrollmentsApi();
        setTotalEnrollment(totalEnrollmentReponse.data.data);
        const totalRevenueResponse = await totalRevenueApi();
        setTotalRevenue(totalRevenueResponse.data.data);
        const topEnrollmentResponse = await topEnrollmentApi();
        console.log(topEnrollmentResponse.data.data);
        setTopEnrollment(topEnrollmentResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="p-4 md:p-6 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold px-2">{totalCourses}</div>
            <div className="text-green-500">
              <TrendingUp size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollment}</div>
            <div className="text-green-500">
              <TrendingUp size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&#8377;{totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Courses</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Enrollments</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topEnrollment.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.courseName}
                      </TableCell>
                      <TableCell>{item.numberOfEnrollments}</TableCell>
                      <TableCell>{item.numberOfComments}</TableCell>
                      <TableCell className="flex items-center">
                        {item.greatestRating ?? 0}{" "}
                        <Star className="w-4 h-4 text-yellow-400 ml-1" />
                      </TableCell>
                      <TableCell>
                        {item.coursePrice !== 0
                          ? ` ₹${item.coursePrice} `
                          : "Free"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
