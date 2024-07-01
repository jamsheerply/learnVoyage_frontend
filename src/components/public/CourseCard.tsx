const CourseCard = () => {
  return (
    <div className="flex lg:flex-row flex-col  w-[80%]  mt-4 lg:rounded-lg overflow-hidden border-2 border-gray-300">
      <div className=" w-96 h-full overflow-hidden bg-green-500">
        <img
          className="w-full h-full "
          src="https://dummyimage.com/600x400/000/fffalt="
        />
      </div>
      <div className=" w-full p-2 flex flex-col justify-between gap-2s">
        <div>
          <h1>name of tutor</h1>
          <h2>course name</h2>
          <div className="flex gap-3">
            <h5>2 week</h5>
            <h5>156 students</h5>
            <h5>All levels</h5>
            <h5>20 Lessons</h5>
          </div>
        </div>
        <div className="flex justify-between border-t-2 border-gray-200">
          <h5>price</h5>
          <h5>view more</h5>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
