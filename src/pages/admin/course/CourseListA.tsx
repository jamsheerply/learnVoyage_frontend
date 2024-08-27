import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ListFilter, Plus } from "lucide-react";
import { getAllCoursesList } from "@/store/course/coursesActions";
import CourseCardSkeleton from "@/components/instructor/courses/CourseCardSkeleton";
import SomeWentWrong from "@/components/public/common/SomeWentWrong";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
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

function CourseListA() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Select category data from Redux store
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  console.log(JSON.stringify(courses));
  // Fetch all courses on component mount
  useEffect(() => {
    dispatch(getAllCoursesList());
  }, [dispatch]);

  // Display skeleton loader while loading
  if (loading) return <CourseCardSkeleton />;

  // Display error component if there's an error
  if (error) return <SomeWentWrong />;

  return (
    <>
      <div>
        {/* Header section with title and create course button */}
        <div className="flex justify-between px-10 mt-4">
          <div className="font-bold  text-2xl">Course List</div>
          <div className="flex gap-2">
            <div>
              <Input
                placeholder="Search"
                className="border-2"
                // value={searchTerm}
                // onChange={handleSearchChange}
              />
            </div>
            <div className="bg-green-100 rounded-sm">
              <Button
                colorScheme="#dcfce7"
                // onClick={onOpen}
              >
                <ListFilter className="cursor-pointer text-green-500 " />
              </Button>
            </div>
          </div>
        </div>
        {/* Render course cards */}
        <div className="px-5">
          <CourseCardA courseData={courses} />
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              // onClick={() => handlePageChange(Math.max(1, page - 1))}
              href="#"
            />
            {/* {Array.from({ length: totalPages }).map((_, index) => ( */}
            <PaginationItem>
              <PaginationLink
                href="#"
                // onClick={() => handlePageChange(index + 1)}
              >
                {/* {index + 1} */}
              </PaginationLink>
            </PaginationItem>
            {/* ))} */}
            <PaginationNext
              // onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              href="#"
            />
          </PaginationContent>
        </Pagination>
      </div>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter</DrawerHeader>

          <DrawerBody className="font-bold">
            {/* <CourseFilter
              header="Method"
              data={method.map((method) => ({
                name: method,
                count: 0,
                id: method,
              }))}
              selectedItems={selectedMethod}
              onItemChange={handleMethodChange}
            /> */}
            {/* <CourseFilter
              header="Status"
              data={status.map((method) => ({
                name: method,
                count: 0,
                id: method,
              }))}
              selectedItems={selectedStatus}
              onItemChange={handleStatusChange}
            /> */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default CourseListA;
