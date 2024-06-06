import { Search } from "lucide-react";
import React from "react";
import homeImg from "../assets/homePage2.png";

const Home: React.FC = () => {
  return (
    <div>
      <hr />
      <div className="lg:flex ">
        <div className=" lg:w-[50%]   lg:text-start lg:px-[100px] lg:bg-white px-[20px]">
          <h4 className="text-bold lg:text-lg text-green-600 py-4">
            Never Stop Learning
          </h4>
          <h1 className="font-extrabold lg:text-5xl my-4 ">
            Grow up your skills by online courses with LearnVoyage
          </h1>
          <p className="lg:py-4  text-bold">
            LearnVoyage is a Golbal training provider based across the India
            that specialises in acrredited and besspoke training coursed.We
            crush the barries togetting a degree
          </p>
          <div className="flex gap-3 lg:my-0 my-3">
            <input
              type="text"
              className="bg-gray-200 lg:p-2 lg:px-4  rounded-md"
            />
            <div className="flex bg-green-600 rounded-md px-2 ">
              <span className="flex items-center">
                <Search />
              </span>
              <button className="p-2 mx-2">search</button>
            </div>
          </div>
        </div>
        <div className="  lg:w-[50%] text-center lg:py-2 lg:my-0 my-3">
          <img src={homeImg} />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
