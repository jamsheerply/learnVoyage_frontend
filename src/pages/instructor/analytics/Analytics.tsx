/* eslint-disable react/react-in-jsx-scope */
import { AccountCard } from "@/components/instructor/analytics/AccountCard";
import { RevenueCard } from "@/components/instructor/analytics/RevenueCard";
import { StatCard } from "@/components/instructor/analytics/StatCard";
import { totalCourseApi } from "@/store/api/CourseApi";
import {
  totalEnrollmentsApi,
  totalRevenueApi,
} from "@/store/api/EnrollmentApi";
import { RootState } from "@/store/store";
import { BookOpen, Folder, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
export default function Analytics() {
  const { user } = useSelector((state: RootState) => state.profile);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalEnrollment, setTotalEnrollment] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalCoursesResponse = await totalCourseApi();
        setTotalCourses(totalCoursesResponse.data.data);
        const totalEnrollmentReponse = await totalEnrollmentsApi();
        setTotalEnrollment(totalEnrollmentReponse.data.data);
        const totalRevenueResponse = await totalRevenueApi();
        setTotalRevenue(totalRevenueResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard
          icon={<BookOpen />}
          title="Courses"
          value={totalCourses.toString()}
        />
        <StatCard
          icon={<Folder />}
          title="Total Subscribers"
          value={totalEnrollment.toString()}
        />
        <StatCard icon={<User />} title="Total Students" value="1" />
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevenueCard title="Monthly Revenue ( July )" value="₹349" />
        <RevenueCard
          title="Total Revenue"
          value={`₹${totalRevenue.toString()}`}
        />

        {}
        <AccountCard
          title="Total Revenue"
          accountName={`${user?.firstName} ${user?.lastName}`}
          accountNumber="2314567/6540"
        />
      </div>
    </div>
  );
}
