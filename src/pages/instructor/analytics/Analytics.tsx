/* eslint-disable react/react-in-jsx-scope */
import { AccountCard } from "@/components/instructor/analytics/AccountCard";
import { RevenueCard } from "@/components/instructor/analytics/RevenueCard";
import { StatCard } from "@/components/instructor/analytics/StatCard";
import { RootState } from "@/store/store";
import { BookOpen, Folder, User } from "lucide-react";
import { useSelector } from "react-redux";
export default function Analytics() {
  const { user } = useSelector((state: RootState) => state.profile);
  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<BookOpen />} title="Courses" value="1" />
        <StatCard icon={<Folder />} title="Total Subscribers" value="1" />
        <StatCard icon={<User />} title="Total Students" value="1" />
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevenueCard
          title="Monthly Revenue ( July )"
          value="₹349"
          //   change="+10% this week"
        />
        <RevenueCard
          title="Total Revenue"
          value="₹349"
          //   change="-22% this week"
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
