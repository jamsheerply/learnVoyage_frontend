import React, { useEffect, useState } from "react";
import { ListFilter } from "lucide-react";
import CourseCardA from "@/components/admin/course/CourseCardA";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import CourseFilter from "@/components/public/course/CourseFilter";
import { useDebounce } from "@/custom Hooks/hooks";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { readAllCategory } from "@/store/category/CategoryActions";
import { getAllInstructorsList } from "@/store/Instructors/InstructorsActions";
import axios from "axios";
import { baseURLCourse } from "@/store/api/CourseApi";

function CourseListA() {
  const dispatch: AppDispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
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
  const [sortBy, setSortBy] = useState<string>("");

  const [courseLoading, setCourseLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(readAllCategory());
    dispatch(getAllInstructorsList());
  }, [dispatch]);
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
  const handleSortChange = (value: string) => {
    setSortBy(value === "default" ? "" : value);
  };

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
      setCourseLoading(true);
      const response = await axios.get(`${baseURLCourse}/read-Admin`, {
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
          sort: sortBy || undefined,
        },
        withCredentials: true,
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

  useEffect(() => {
    fetchCourses();
  }, [
    page,
    debouncedSearch,
    selectedCategories,
    selectedInstructors,
    selectedPrices,
    sortBy,
  ]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div>
        {/* Header section with title and create course button */}
        <div className="flex justify-between px-10 mt-4">
          <div className="font-bold  text-2xl">Course List</div>
          <div className="flex gap-2">
            <div className="">
              <Input
                placeholder="Search"
                className="border-2"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="w-1/3">
              <Select onValueChange={handleSortChange} value={sortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">None </SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="name_asc">Name: A to Z</SelectItem>
                  <SelectItem value="name_desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-green-100 rounded-sm">
              <Button colorScheme="#dcfce7" onClick={onOpen}>
                <ListFilter className="cursor-pointer text-green-500 " />
              </Button>
            </div>
          </div>
        </div>
        {/* Render course cards */}
        <div className="px-5">
          <CourseCardA courseData={courses} />
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

export default CourseListA;
