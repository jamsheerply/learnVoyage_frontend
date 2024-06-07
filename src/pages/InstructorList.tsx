import { CSSProperties, useEffect, useState } from "react";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { getAllInstructorsList } from "../store/Instructors/InstructorsActions";
import { AppDispatch, RootState } from "../store/store";
import ClipLoader from "react-spinners/ClipLoader";

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

const InstructorList = () => {
  const dispatch: AppDispatch = useDispatch();
  let [color, setColor] = useState("#ffffff");
  const { instructors, loading, error } = useSelector(
    (state: RootState) => state.instructors
  );

  useEffect(() => {
    dispatch(getAllInstructorsList());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex items-center justify-center">
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
  if (error) return <p>Error: {error}</p>;

  const formattedInstructors = instructors.map((instructor: Instructor) => ({
    firstName: instructor.firstName,
    lastName: instructor.lastName,
    email: instructor.email,
    isBlocked: instructor.isBlocked,
    id: instructor.id,
  }));

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
