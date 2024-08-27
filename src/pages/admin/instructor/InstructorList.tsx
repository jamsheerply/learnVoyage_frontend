/* eslint-disable react/react-in-jsx-scope */

import { CSSProperties, useEffect, useState } from "react";
import Table from "../../../components/admin/instructor/Table";
import { useDispatch, useSelector } from "react-redux";
import { getAllInstructorsList } from "../../../store/Instructors/InstructorsActions";
import { AppDispatch, RootState } from "../../../store/store";
import ClipLoader from "react-spinners/ClipLoader";
import SomeWentWrong from "../../../components/public/common/SomeWentWrong";
import { Input } from "@/shadcn/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Button } from "@/shadcn/ui/button";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

interface Instructor {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  id: string;
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "green",
};

type Checked = DropdownMenuCheckboxItemProps["checked"];

const InstructorList = () => {
  const dispatch: AppDispatch = useDispatch();
  const [color] = useState("#ffffff");
  const { instructors, loading, error } = useSelector(
    (state: RootState) => state.instructors
  );

  useEffect(() => {
    dispatch(getAllInstructorsList());
  }, [dispatch]);

  const formattedInstructors = instructors.map((instructor: Instructor) => ({
    firstName: instructor.firstName,
    lastName: instructor.lastName,
    email: instructor.email,
    isBlocked: instructor.isBlocked,
    id: instructor.id,
  }));

  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  // const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
  const [showPanel, setShowPanel] = useState<Checked>(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (error) {
    return <SomeWentWrong />;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mx-4 my-3">
        <div className="text-lg font-semibold">Instructors</div>
        <div className="flex flex-col md:flex-row gap-3 items-center mt-2 md:mt-0">
          <div className="w-full md:w-48">
            <Input placeholder="Search" />
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
      </div>
      <div className="overflow-x-auto">
        <Table
          TableHead={["Name", "Email", "Status", "Action"]}
          TableData={formattedInstructors}
        />
      </div>
      <Pagination className="flex justify-center mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default InstructorList;
