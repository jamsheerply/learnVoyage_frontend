import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Progress } from "@/shadcn/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import {
  readCompletedCoursesApi,
  readRecentEnrollmentApi,
} from "@/store/api/EnrollmentApi";
import { readExamPassRateApi } from "@/store/api/ResultApi";
import { ExtendedEnrollmentEntity } from "@/types/enrollmentEntity";

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

// Mock data for the chart
const activityData = [
  { date: "10 Oct", exam: 15, course: 10 },
  { date: "12 Oct", exam: 20, course: 15 },
  { date: "14 Oct", exam: 18, course: 22 },
  { date: "16 Oct", exam: 25, course: 28 },
  { date: "18 Oct", exam: 30, course: 20 },
  { date: "20 Oct", exam: 22, course: 25 },
  { date: "22 Oct", exam: 28, course: 30 },
  { date: "24 Oct", exam: 32, course: 28 },
];

const DashboardStudent: React.FC = () => {
  const [completedCourses, setCompletedCourses] = useState<
    { courseName: string; completedPercentage: number }[]
  >([]);

  const [examPassRate, setExamPassRate] = useState<{
    passed: number;
    failed: number;
    pending: number;
  }>({ passed: 0, failed: 0, pending: 0 });

  const [recentEnrollments, setRecentEnrollments] = useState<
    ExtendedEnrollmentEntity[]
  >([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const completedCoursesData = await readCompletedCoursesApi();
      setCompletedCourses(completedCoursesData.data.data);
      const examPassRate = await readExamPassRateApi();
      setExamPassRate(examPassRate.data.data);
      const recentEnrollment = await readRecentEnrollmentApi();
      setRecentEnrollments(recentEnrollment.data.data);
    };
    fetchData();
  }, []);

  const examPassRateData = useMemo(
    () => ({
      labels: ["Passed", "Failed", "Pending"],
      datasets: [
        {
          data: [
            examPassRate.passed,
            examPassRate.failed,
            examPassRate.pending,
          ],
          backgroundColor: ["#10B981", "#EF4444", "#9CA3AF"],
          borderColor: ["#10B981", "#EF4444", "#9CA3AF"],
          borderWidth: 1,
        },
      ],
    }),
    [examPassRate]
  );

  const examPassRateOptions = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const, // Type assertion to fix the position error
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const centerText = useCallback(
    (chart: any) => {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      ctx.save();
      const passRate = examPassRate.passed;
      const text = `${passRate}%`;
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = passRate > 0 ? "#10B981" : "#EF4444";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, left + width / 2, top + height / 2);
      ctx.restore();
    },
    [examPassRate.passed]
  );

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completedCourses.length && activityData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="exam"
                    stroke="#8884d8"
                    name="Exam Activity"
                  />
                  <Line
                    type="monotone"
                    dataKey="course"
                    stroke="#82ca9d"
                    name="Course Activity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Exam Pass Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              <Doughnut
                data={examPassRateData}
                options={examPassRateOptions}
                plugins={[{ id: "centerText", afterDraw: centerText }]}
                key={JSON.stringify(examPassRate)} // Force re-render when data changes
              />
            </div>
          </CardContent>
        </Card>

        {/* Completed Courses */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {course.courseName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={course.completedPercentage}
                      className="w-24"
                    />
                    <span className="text-sm font-medium">
                      {course.completedPercentage}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentEnrollments.slice(0, 5).map((enrollment, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-sm truncate">
                    {enrollment.course.courseName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Recent Enrollments */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detailed Recent Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentEnrollments.slice(0, 2).map((enrollment, index) => (
              <Card key={index}>
                <img
                  src={enrollment.course.courseThumbnailUrl}
                  alt={enrollment.course.courseName}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {enrollment.course.courseName}
                  </h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Lessons: {enrollment.course.lessons.length}</span>
                    <span>{enrollment.course.level || "Medium"}</span>
                  </div>
                  <div className="mb-4">
                    <Progress
                      value={
                        (enrollment.progress?.completedLessons?.length /
                          enrollment.course.lessons.length) *
                        100
                      }
                      className="h-2 mb-1"
                    />
                    <div className="flex justify-between text-sm">
                      <span>
                        Progress:{" "}
                        {Math.round(
                          (enrollment.progress?.completedLessons?.length /
                            enrollment.course.lessons.length) *
                            100
                        )}
                        %
                      </span>
                      <span>
                        Enrolled:{" "}
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded w-full"
                    onClick={() =>
                      navigate(`/student/enrollments/${enrollment._id}`)
                    }
                  >
                    Continue Course
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStudent;
