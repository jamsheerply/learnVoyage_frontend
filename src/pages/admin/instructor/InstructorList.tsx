import React, { useEffect, useState } from "react";
import { Input } from "@/shadcn/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import { Filter, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Button } from "@/shadcn/ui/button";
import { useDebounce } from "@/custom Hooks/hooks";
import axios from "axios";
import { IUser } from "@/types/user.entity";
import Table from "@/components/admin/instructor/Table";

const InstructorList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "unblocked" | "blocked"
  >("all");
  const [instructors, setInstructors] = useState<IUser[]>([]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (status: "all" | "unblocked" | "blocked") => {
    setFilterStatus(status);
    setPage(1); // Reset to first page on filter change
  };

  const totalPages = Math.ceil(total / limit);

  const fetchInstructors = async () => {
    const baseURL = `${import.meta.env.VITE_BASE_URL}/users`;
    const api = axios.create({
      baseURL: baseURL,
      withCredentials: true,
    });
    try {
      console.log("Sending request with params:", {
        page,
        limit,
        search: debouncedSearch,
        filter: filterStatus,
      });
      const response = await api.get("/instructor/read", {
        params: {
          page,
          limit,
          search: debouncedSearch || "",
          filter: filterStatus,
        },
      });
      setTotal(response.data.data.total);
      setInstructors(response.data.data.users);
      // console.log("instructors", JSON.stringify(instructors));
    } catch (error) {
      console.log(error);
    }
  };

  const handleInstructorUpdate = (updatedInstructor: IUser) => {
    setInstructors((prevInstructors) =>
      prevInstructors.map((instructor) =>
        instructor._id === updatedInstructor._id
          ? updatedInstructor
          : instructor
      )
    );
  };

  useEffect(() => {
    fetchInstructors();
  }, [page, limit, debouncedSearch, filterStatus]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <SomeWentWrong />;
  // }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center my-4">
        <h1 className="text-2xl font-semibold mb-4 md:mb-0">Instructors</h1>
        <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filterStatus === "all"}
                onCheckedChange={() => handleFilterChange("all")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterStatus === "unblocked"}
                onCheckedChange={() => handleFilterChange("unblocked")}
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterStatus === "blocked"}
                onCheckedChange={() => handleFilterChange("blocked")}
              >
                Blocked
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table
          instructors={instructors}
          onInstructorUpdate={handleInstructorUpdate}
        />
      </div>
      {total > limit && (
        <Pagination className="my-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={`page-${index + 1}`}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default InstructorList;
