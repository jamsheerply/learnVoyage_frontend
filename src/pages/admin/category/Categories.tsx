import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableCategories from "../../../components/admin/category/TableCategories";
import { AppDispatch, RootState } from "../../../store/store";
import { readAllCategory } from "../../../store/category/CategoryActions";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import SomeWentWrong from "../../../components/public/common/SomeWentWrong";
import { Input } from "@/shadcn/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/shadcn/ui/button";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const Categories = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  const [showPanel, setShowPanel] = useState<Checked>(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const total = filteredCategories.length;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    dispatch(readAllCategory());
  }, [dispatch]);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = () => {
    const active = showStatusBar ? "active" : "";
    const blocked = showPanel ? "blocked" : "";

    const filtered = categories.filter((category) => {
      if (active && blocked) return true;
      if (active) return !category.isBlocked;
      if (blocked) return category.isBlocked;
      return true;
    });
    setFilteredCategories(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [showStatusBar, showPanel, categories]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * limit,
    page * limit
  );

  const override = {
    display: "block",
    margin: "0 auto",
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <ClipLoader
            color={"#36D7B7"}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      {error && <SomeWentWrong />}
      {!loading && !error && (
        <div className="space-y-6 py-3 ">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-semibold px-3">Categories</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-48"
              />
              <div className="flex space-x-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={showStatusBar}
                      onCheckedChange={setShowStatusBar}
                    >
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={showPanel}
                      onCheckedChange={setShowPanel}
                    >
                      Blocked
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
                  onClick={() => navigate("/admin/add-category")}
                >
                  Add Category
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {paginatedCategories.length > 0 && (
              <TableCategories
                TableHead={[
                  "SlNo",
                  "Category Name",
                  "Status",
                  "Image",
                  "Action",
                ]}
                TableData={paginatedCategories}
              />
            )}
          </div>

          {total > limit && (
            <Pagination className="flex justify-center mt-6">
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
                      className={page === index + 1 ? "bg-blue-100" : ""}
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
      )}
    </div>
  );
};

export default Categories;
