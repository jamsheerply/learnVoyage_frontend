import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TableCategories from "../../../components/admin/category/TableCategories";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState } from "react";
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
    <div>
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
        <>
          <div className="flex justify-end mr-16 m-3">
            <button
              className="bg-green-500 p-2 rounded-lg font-semibold text-white"
              onClick={() => {
                navigate("/admin/add-category");
              }}
            >
              Add Category
            </button>
          </div>
          <div className="flex justify-between my-2 mr-16 ml-3">
            <div className="w-48">
              <Input
                placeholder="search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter />
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
          </div>
          {paginatedCategories.length > 0 && (
            <TableCategories
              TableHead={["SlNo", "Category Name", "Status", "Image", "Action"]}
              TableData={paginatedCategories}
            />
          )}
          <Pagination className="flex justify-center">
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
        </>
      )}
    </div>
  );
};

export default Categories;
