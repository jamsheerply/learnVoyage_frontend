import React from "react";

interface CourseFilterProps {
  header: string;
  data: { name: string; count: number; id: string }[];
  selectedItems: { [key: string]: boolean };
  onItemChange: (name: string) => void;
}

const CourseFilter: React.FC<CourseFilterProps> = ({
  header,
  data,
  selectedItems,
  onItemChange,
}) => {
  return (
    <>
      <h1 className="my-3">{header}</h1>
      {data &&
        data.map((item, index) => (
          <div key={index} className="flex justify-between gap-2">
            <h5 className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-md"
                checked={selectedItems[item.id] || false}
                onChange={() => onItemChange(item.id)}
              />
              {item.name}
            </h5>
            {/* <h5>{item.count}</h5> */}
          </div>
        ))}
    </>
  );
};

export default CourseFilter;
