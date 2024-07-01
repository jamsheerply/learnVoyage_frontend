const CourseFilter = () => {
  return (
    <>
      <h1 className="my-3">course Category</h1>
      <div className="flex justify-between gap-2">
        <h5 className="flex gap-2 items-center">
          <input
            type="checkbox"
            defaultChecked
            className="checkbox checkbox-md"
          />
          Commercial
        </h5>
        <h5>15</h5>
      </div>
      <div className="flex justify-between gap-2">
        <h5 className="flex gap-2 items-center">
          <input
            type="checkbox"
            defaultChecked
            className="checkbox checkbox-md"
          />
          Commercial
        </h5>
        <h5>15</h5>
      </div>
      <div className="flex justify-between gap-2">
        <h5 className="flex gap-2 items-center">
          <input
            type="checkbox"
            defaultChecked
            className="checkbox checkbox-md"
          />
          Commercial
        </h5>
        <h5>15</h5>
      </div>
    </>
  );
};

export default CourseFilter;
