import React, { useState } from "react";
import { ListFilter } from "lucide-react";
import CourseCard from "../../../components/instructor/courses/CourseCard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
// import SomeWentWrong from "../../../components/public/common/SomeWentWrong";
import "react-loading-skeleton/dist/skeleton.css";
// import CourseCardSkeleton from "../../../components/instructor/courses/CourseCardSkeleton";
import { Input } from "@/shadcn/ui/input";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import CourseFilter from "@/components/public/course/CourseFilter";
import { readAllCategory } from "@/store/category/CategoryActions";
import { getAllInstructorsList } from "@/store/Instructors/InstructorsActions";
import { useDebounce } from "@/custom Hooks/hooks";
import { ICourse } from "@/types/course.entity";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import { Button as ButtonS } from "@/shadcn/ui/button";
import axios, { AxiosInstance } from "axios";
const CoursesList = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [courses, setCourses] = useState<ICourse[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const [total, setTotal] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedPrices, setSelectedPrices] = useState<{
    [key: string]: boolean;
  }>({});
  // const [loading, setLoading] = useState<boolean>(false);

  const { categories } = useSelector((state: RootState) => state.category);

  const prices = ["All", "Free", "Paid"];
  const fetchCourses = async () => {
    try {
      const selectedCategoryIds = Object.keys(selectedCategories).filter(
        (key) => selectedCategories[key]
      );
      const selectedPriceIds = Object.keys(selectedPrices).filter(
        (key) => selectedPrices[key]
      );

      const baseURL = `${import.meta.env.VITE_BASE_URL}/content-management`;

      const api: AxiosInstance = axios.create({
        baseURL: baseURL,
        withCredentials: true,
      });
      // setLoading(true);
      const response = await api.get("/course/read-filer", {
        params: {
          page,
          limit,
          search: debouncedSearch || "",
          category:
            selectedCategoryIds.length > 0
              ? selectedCategoryIds.join(",")
              : "All",
          price:
            selectedPriceIds.length > 0 ? selectedPriceIds.join(",") : "All",
        },
      });
      console.log(response.data.data);
      setCourses(response.data.data.courses);
      setTotal(response.data.data.total);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, limit, debouncedSearch, selectedCategories, selectedPrices]);
  // Fetch all courses on component mount
  useEffect(() => {
    // dispatch(getAllCoursesList());
    dispatch(readAllCategory());
    dispatch(getAllInstructorsList());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (name: string) => {
    setSelectedCategories((prevState) => ({
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  // Display skeleton loader while loading
  // if (loading) return <CourseCardSkeleton />;

  // Display error component if there's an error
  // if (error) return <SomeWentWrong />;

  return (
    <>
      <div>
        {/* Header section with title and create course button */}
        <div className="flex justify-between p-2 px-5 h-full overflow-y-auto">
          <div className=" font-bold text-xl">YOUR COURSES</div>
          <div className="flex items-center gap-3">
            <div>
              <Input
                placeholder="Search"
                className=" border-2"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="bg-green-100 rounded-sm">
              <Button colorScheme="#dcfce7" onClick={onOpen}>
                <ListFilter className="cursor-pointer text-green-500 " />
              </Button>
            </div>
            <ButtonS
              onClick={() => {
                navigate("/instructor/create-course");
              }}
              className="bg-green-400 hover:bg-green-600 text-white w-full sm:w-auto"
            >
              Add Course
            </ButtonS>
          </div>
        </div>
        {/* Render course cards */}

        <div>
          <CourseCard courseData={courses} />
        </div>
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
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                href="#"
              />
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter</DrawerHeader>

          <DrawerBody className="font-bold">
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
              header="Price"
              data={prices.map((price) => ({
                name: price,
                count: 0,
                id: price,
              }))}
              selectedItems={selectedPrices}
              onItemChange={handlePriceChange}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CoursesList;
