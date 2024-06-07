import { useDispatch } from "react-redux";
import TableCategories from "../components/TableCategories";
import { AppDispatch } from "../store/store";
import { getAllInstructorsList } from "../store/Instructors/InstructorsActions";

const Categories = () => {
  interface Instructor {
    firstName: string;
    lastName: string;
    email: string;
    isBlocked: boolean;
    id: string;
  }
  const dispatch: AppDispatch = useDispatch();
  dispatch(getAllInstructorsList());
  const formattedInstructors = {
    firstName: "instructor.firstName",
    lastName: "instructor.lastName",
    email: "instructor.email",
    isBlocked: "instructor.isBlocked",
    id: "instructor.id",
  };
  return (
    <TableCategories
      TableHead={["Name", "Email", "Status", "Action"]}
      TableData={formattedInstructors}
    />
  );
};

export default Categories;
