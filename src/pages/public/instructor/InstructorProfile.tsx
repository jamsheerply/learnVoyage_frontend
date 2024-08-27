import React, { useState, useEffect } from "react";
import { StarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/shadcn/ui/card";
import img from "../../../assets/profilePic.svg";

const InstructorProfile = () => {
  const scrollContainer = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      const scrollAmount = scrollContainer.current.clientWidth;
      scrollContainer.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Akshay Kashyap</h1>
          <p className="text-gray-600">
            Website Designer, Full Stack Developer
          </p>
        </div>
        <img
          src={img}
          alt="Akshay Kashyap"
          className="w-24 h-24 rounded-full"
        />
      </div>

      <div className="flex space-x-6 mb-6">
        <div>
          <p className="font-semibold">Total students</p>
          <p className="text-2xl font-bold">27,411</p>
        </div>
        <div>
          <p className="font-semibold">Reviews</p>
          <p className="text-2xl font-bold">1,294</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">About me</h2>
          <p className="text-gray-700">
            This is Akshay Kashyap. I am a Website Designer and Full Stack
            Developer. I have 4 years of experience in website development. I
            love to write code and make different applications in different
            languages.
          </p>
        </CardContent>
      </Card>

      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My courses (5)</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full ${
                canScrollLeft
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full ${
                canScrollRight
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div
          ref={scrollContainer}
          className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
          onScroll={checkScroll}
        >
          {[1, 2, 3, 4, 5].map((course) => (
            <Card
              key={course}
              className="flex-shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <CardContent className="pt-6">
                <img
                  src={img}
                  alt="Course thumbnail"
                  className="w-full h-40 object-cover mb-4 rounded"
                />
                <h3 className="font-semibold mb-1">Course Title {course}</h3>
                <p className="text-sm text-gray-600 mb-2">Akshay Kashyap</p>
                <div className="flex items-center">
                  <span className="font-bold mr-2">3.5</span>
                  <div className="flex">
                    {[1, 2, 3].map((i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                    {[4, 5].map((i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-gray-300 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">(100)</span>
                </div>
                <p className="mt-2">
                  <span className="font-semibold">₹499</span>{" "}
                  <span className="line-through text-gray-500">₹799</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
