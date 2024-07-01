import InputProfile from "../components/InputProfile";
import InputProfile2 from "../components/InputProfileSecond";
import profileImg from "../assets/profilePic.svg";

const Profile = () => {
  return (
    <div className=" mx-[10%] w-[80%]">
      <div className="p-2">Generals</div>
      <div className="flex justify-center">
        <div className="w-[80%] ">
          <div className="flex gap-5">
            <span>
              <InputProfile type="text" placeholder="First Name" />
            </span>
            <span>
              <InputProfile type="text" placeholder="Last Name" />
            </span>
          </div>
          <div className="flex gap-5">
            <span>
              <InputProfile type="text" placeholder="Email" />
            </span>
            <span>
              <InputProfile type="text" placeholder="Phone Number" />
            </span>
          </div>
          <div className="flex gap-5">
            <span>
              <InputProfile type="text" placeholder="Profession" />
            </span>
            <span>
              <InputProfile type="text" placeholder="UserName" />
            </span>
          </div>
          <div className="flex gap-5">
            <span>
              <InputProfile type="text" placeholder="Password" />
            </span>
            <span>
              <InputProfile type="text" placeholder="Confirm Password" />
            </span>
          </div>
        </div>
        <div className=" w-[20%] flex justify-center items-center flex-col">
          <div className=" h-[75%] w-[80%] bg-green-200">
            <img src={profileImg} className="w-full h-full  " />
          </div>
          <div className=" p-1 mt-2 w-[80%] text-center rounded-md border  text-gray-500 cursor-pointer">
            Change Image
          </div>
        </div>
      </div>
      <div className="p-2">Other Information</div>
      <div className="w-[80%] ">
        <div className="flex gap-5">
          <span>
            <InputProfile2 type="text" placeholder="Address" />
          </span>
          <span>
            <InputProfile2 type="text" placeholder="City" />
          </span>
          <span>
            <InputProfile2 type="text" placeholder="Country" />
          </span>
        </div>
        <div>
          <textarea
            className="w-[1000px] h-[120px] p-2 border m-2 "
            placeholder="About info"
          />
        </div>
      </div>
      <div className="flex justify-end  ">
        <button className="p-3 mx-2 border   bg-green-500 rounded-lg w-[150px]">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
