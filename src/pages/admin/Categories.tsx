import { useDispatch, useSelector } from "react-redux";
import TableCategories from "../../components/TableCategories";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { readAllCategory } from "../../store/category/CategoryActions";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import SomeWentWrong from "../../components/SomeWentWrong";

const Categories = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );

  useEffect(() => {
    dispatch(readAllCategory());
  }, [dispatch]);

  const formattedCategories = categories.map((category) => ({
    id: category.id,
    categoryName: category.categoryName,
    isBlocked: category.isBlocked,
    image: category.image,
  }));

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
          <div className="flex justify-end mr-24 m-3">
            <button
              className="bg-green-500 p-2 rounded-lg font-semibold text-white"
              onClick={() => {
                navigate("/admin/add-category");
              }}
            >
              Add Category
            </button>
          </div>
          {formattedCategories.length > 0 && (
            <TableCategories
              TableHead={["Category Name", "Status", "Image", "Action"]}
              TableData={formattedCategories}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Categories;
