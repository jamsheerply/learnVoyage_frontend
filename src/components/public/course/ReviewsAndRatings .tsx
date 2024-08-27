import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Avatar, AvatarFallback } from "@/shadcn/ui/avatar";
import { format, isToday, parseISO } from "date-fns";
import { readAllStudentApi } from "@/store/api/AuthApi";
import { IUser } from "@/types/user.entity";

const ReviewsAndRatings = ({ course }) => {
  const [student, setStudent] = useState<IUser[] | null>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const studentResponse = await readAllStudentApi();

      setStudent(studentResponse.data.data);
    };
    fetchUser();
  }, []);

  const findStudentInfo = (
    userId: string,
    students: IUser[],
    infoType = "full"
  ) => {
    const student = students.find((s) => s._id === userId);

    if (!student) {
      return null;
    }

    switch (infoType) {
      case "firstName":
        return student.firstName;
      case "lastName":
        return student.lastName;
      case "avatar":
        return student.profile?.avatar || null;
      case "Avatar":
        return {
          avatar: student.profile?.avatar || null,
        };
      case "full":
      default:
        return `${student.firstName} ${student.lastName}`;
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center mb-4">
        <span className="font-bold text-xl">Ratings and Review</span>
      </div>
      {course.slice(0, 2).map((review, index) => (
        <Card className="h-full" key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>
                  {findStudentInfo(review.userId, student, "lastName")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-sm font-medium">
                {findStudentInfo(review.userId, student, "full")}
              </CardTitle>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="ml-2 text-xs text-gray-500">
                {(() => {
                  const date = parseISO(review.updatedAt);
                  return isToday(date)
                    ? format(date, "HH:mm")
                    : format(date, "yyyy-MM-dd");
                })()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{review.review}</p>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="mt-6">
        Show all reviews
      </Button>
    </div>
  );
};

export default ReviewsAndRatings;
