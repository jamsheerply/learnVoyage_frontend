import CourseFilter from "@/components/public/course/CourseFilter";
import EnrollmentCourseCard from "@/components/student/enrollment/EnrollmentCourseCard";
import { Input } from "@/shadcn/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import { readAllCategory } from "@/store/category/CategoryActions";
import { getAllInstructorsList } from "@/store/Instructors/InstructorsActions";
import { AppDispatch, RootState } from "@/store/store";
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
import axios, { AxiosInstance } from "axios";
import { ListFilter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function EnrollmentList() {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(4);
  const [total, setTotal] = useState<number>(0);
  const [enrollment, setEnrollment] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedInstructors, setSelectedInstructors] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedPrices, setSelectedPrices] = useState<{
    [key: string]: boolean;
  }>({});

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

  useEffect(() => {
    dispatch(readAllCategory());
    dispatch(getAllInstructorsList());
  }, [dispatch]);

  const fetchCourses = async () => {
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

      const baseURL = `${import.meta.env.VITE_BASE_URL}/content-management`;

      const api: AxiosInstance = axios.create({
        baseURL: baseURL,
        withCredentials: true,
      });

      const response = await api.get("/enrollment/read", {
        params: {
          page,
          limit,
          search: searchTerm || "",
          category:
            selectedCategoryIds.length > 0
              ? selectedCategoryIds.join(",")
              : "All",
          instructor: selectedInstructorIds.join(","),
          price:
            selectedPriceIds.length > 0 ? selectedPriceIds.join(",") : "All",
        },
      });

      setEnrollment(response.data.data.enrollments);
      console.log(JSON.stringify(response.data.data.enrollments));
      setTotal(response.data.data.total);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [
    page,
    limit,
    searchTerm,
    selectedCategories,
    selectedInstructors,
    selectedPrices,
  ]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

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
          </div>
        </div>
        {/* Render course cards */}
        <div className="">
          {enrollment.length === 0 ? (
            <div className="text-center font-extrabold text-2xl">
              No result found
            </div>
          ) : (
            // enrollment.map((enroll) => (
            <EnrollmentCourseCard enrollment={enrollment} />
            // ))
          )}
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default EnrollmentList;
