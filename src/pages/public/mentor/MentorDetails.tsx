import React from "react";

const MentorDetails: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-green-50 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-4 md:mb-0">
            <img
              src="https://res.cloudinary.com/dwcytg5ps/image/upload/v1720074303/erx24gyqq4jrlfpyat3h.jpg"
              alt="Kritsin Watson"
              className="w-40 h-40 rounded-full mx-auto md:mx-0"
            />
          </div>
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold">Kritsin Watson</h1>
            <p className="text-gray-600 text-lg mb-4">Founder & Mentor</p>

            <div className="grid grid-cols-2 gap-y-2 gap-x-8">
              <div>
                <p className="text-sm text-gray-500">Total Course</p>
                <p className="font-semibold">30</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="font-semibold">4.9 (153)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experiences</p>
                <p className="font-semibold">10 Years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Graduated</p>
                <p className="font-semibold">Yes</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Language</p>
                <p className="font-semibold">English, French</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex space-x-4 mb-6">
            <button className="bg-green-600 text-white px-6 py-2 rounded-md">
              About
            </button>
            <button className="text-gray-600 px-6 py-2 rounded-md">
              Courses
            </button>
            <button className="text-gray-600 px-6 py-2 rounded-md">
              Reviews
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">About Kritsin</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
              accumsan lacus vel facilisis consectetur adipiscing elit.
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Certification</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
              accumsan lacus vel facilisis consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetails;
