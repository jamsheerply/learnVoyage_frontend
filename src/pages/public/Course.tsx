import React from "react";
import { Filter } from "lucide-react";
import CourseCard from "../../components/public/course/CourseCard";
import CourseFilter from "../../components/public/course/CourseFilter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import Footer from "../../components/public/common/Footer";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { readAllCategory } from "@/store/category/CategoryActions";
import { useEffect, useState } from "react";
import { getAllInstructorsList } from "@/store/Instructors/InstructorsActions";
import { Input } from "@/shadcn/ui/input";
import axios from "axios";
import { baseURLCourse } from "@/store/api/CourseApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebounce } from "@/custom Hooks/hooks";
import CourseCardSkeleton from "@/components/public/course/CourseCardSkeleton";

const Course = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(4);
  const [total, setTotal] = useState<number>(0);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedInstructors, setSelectedInstructors] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedPrices, setSelectedPrices] = useState<{
    [key: string]: boolean;
  }>({});

  const [courseLoading, setCourseLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(readAllCategory());
    dispatch(getAllInstructorsList());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
    setPage(Number(params.get("page")) || 1);
    setSelectedCategories(
      params
        .get("category")
        ?.split(",")
        .reduce((acc, category) => {
          acc[category] = true;
          return acc;
        }, {} as { [key: string]: boolean }) || {}
    );
    setSelectedInstructors(
      params
        .get("instructor")
        ?.split(",")
        .reduce((acc, instructor) => {
          acc[instructor] = true;
          return acc;
        }, {} as { [key: string]: boolean }) || {}
    );
    setSelectedPrices(
      params
        .get("price")
        ?.split(",")
        .reduce((acc, price) => {
          acc[price] = true;
          return acc;
        }, {} as { [key: string]: boolean }) || {}
    );
  }, [location.search]);

  useEffect(() => {
    fetchCourses();
  }, [
    page,
    debouncedSearch,
    selectedCategories,
    selectedInstructors,
    selectedPrices,
  ]);

  const { categories } = useSelector((state: RootState) => state.category);
  const { instructors } = useSelector((state: RootState) => state.instructors);

  const prices = ["All", "Free", "Paid"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (name: string) => {
    setSelectedCategories((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const handleInstructorChange = (name: string) => {
    setSelectedInstructors((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const handlePriceChange = (name: string) => {
    setSelectedPrices((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const updateUrlParams = () => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (searchTerm) params.set("search", debouncedSearch);
    const selectedCategoryKeys = Object.keys(selectedCategories).filter(
      (key) => selectedCategories[key]
    );
    if (selectedCategoryKeys.length)
      params.set("category", selectedCategoryKeys.join(","));
    const selectedInstructorKeys = Object.keys(selectedInstructors).filter(
      (key) => selectedInstructors[key]
    );
    if (selectedInstructorKeys.length)
      params.set("instructor", selectedInstructorKeys.join(","));
    const selectedPriceKeys = Object.keys(selectedPrices).filter(
      (key) => selectedPrices[key]
    );
    if (selectedPriceKeys.length)
      params.set("price", selectedPriceKeys.join(","));

    navigate(`?${params.toString()}`);
  };

  const fetchCourses = async () => {
    updateUrlParams();
    try {
      const selectedCategoryIds = Object.keys(selectedCategories).filter(
        (key) => selectedCategories[key]
      );
      const selectedInstructorIds = Object.keys(selectedInstructors).filter(
        (key) => selectedInstructors[key]
      );
      const selectedPriceIds = Object.keys(selectedPrices).filter(
        (key) => selectedPrices[key]
      );
      setCourseLoading(true);
      const response = await axios.get(`${baseURLCourse}/read`, {
        params: {
          page,
          limit,
          search: debouncedSearch || "",
          category:
            selectedCategoryIds.length > 0
              ? selectedCategoryIds.join(",")
              : "All",
          instructor: selectedInstructorIds.join(","),
          price:
            selectedPriceIds.length > 0 ? selectedPriceIds.join(",") : "All",
        },
      });
      if (response.data.data.courses) {
        setCourseLoading(false);
      }
      setCourses(response.data.data.courses);
      console.log(JSON.stringify(response.data.data.courses));
      setTotal(response.data.data.total);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {/* White space */}
      <div className="h-8 hidden lg:block"></div>
      <div>
        <div className="flex w-[88%] min-h-screen mx-auto py-2">
          <div className="w-full">
            <div className="flex lg:justify-start justify-between w-full">
              <h1 className="font-semibold text-3xl my-2">All Courses</h1>
              <span className="lg:hidden block">
                <Filter />
              </span>
            </div>
            {courseLoading ? (
              <CourseCardSkeleton />
            ) : courses.length === 0 ? (
              <div className="text-center mt-20">No courses available</div>
            ) : (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}

            {total > limit && (
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    href="#"
                  />
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, page + 1))
                    }
                    href="#"
                  />
                </PaginationContent>
              </Pagination>
            )}
          </div>
          <div className="w-96 lg:block hidden">
            <div className="mt-10">
              <Input
                placeholder="search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <CourseFilter
              header="Course Category"
              data={categories.map((category) => ({
                name: category.categoryName,
                count: 0,
                id: category.id,
              }))}
              selectedItems={selectedCategories}
              onItemChange={handleCategoryChange}
            />
            <CourseFilter
              header="Instructor"
              data={instructors.map((instructor) => ({
                name: `${instructor.firstName} ${instructor.lastName}`,
                count: 0,
                id: instructor.id,
              }))}
              selectedItems={selectedInstructors}
              onItemChange={handleInstructorChange}
            />
            <CourseFilter
              header="Price"
              data={prices.map((price) => ({
                name: price,
                count: 0,
                id: price,
              }))}
              selectedItems={selectedPrices}
              onItemChange={handlePriceChange}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Course;
