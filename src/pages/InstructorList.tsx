import { useEffect } from "react";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { getAllInstructorsList } from "../store/getAllInstructors/getAllInstructorsActions";
import { AppDispatch, RootState } from "../store/store";

interface Instructor {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  id: string;
}

const InstructorList = () => {
  const dispatch: AppDispatch = useDispatch();
  const instructors = useSelector(
    (state: RootState) => state.instructors.instructors
  );

  const formattedInstructors: Instructor[] = instructors.map(
    (instructor: any) => ({
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      email: instructor.email,
      isBlocked: instructor.isBlocked,
      id: instructor.id,
    })
  );

  useEffect(() => {
    dispatch(getAllInstructorsList());
  }, [dispatch]);

  console.log(JSON.stringify(instructors));

  return (
    <>
      <Table
        TableHead={["Name", "Email", "Status", "Action"]}
        TableData={formattedInstructors}
      />
    </>
  );
};

export default InstructorList;
