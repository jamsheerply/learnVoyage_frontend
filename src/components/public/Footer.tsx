import React from "react";
import { Logo } from "../Logo";
import { SocialIcon } from "react-social-icons";
const Footer = () => {
  return (
    <div className="w-[88%]  mx-auto my-4">
      <div className="flex justify-between">
        <div className="">
          <Logo />
          <div className="flex gap-1 my-3">
            <SocialIcon network="twitter" style={{ height: 25, width: 25 }} />
            <SocialIcon network="facebook" style={{ height: 25, width: 25 }} />
            <SocialIcon network="linkedin" style={{ height: 25, width: 25 }} />
            <SocialIcon network="instagram" style={{ height: 25, width: 25 }} />
          </div>
          <h6 className="mb-1">&#169;2021 Eduvi.co</h6>
          <h6>Eduvi is a registered</h6>
          <h6>trademark of Eduvi.co</h6>
        </div>
        <div>
          <h1 className="font-semibold text-xl my-2">Courses</h1>
          <h6>Classroom courses</h6>
          <h6>Virtual classroom courses</h6>
          <h6>E-learning courses</h6>
          <h6>Video Courses</h6>
          <h6>offline Courses</h6>
        </div>
        <div>
          <h1 className="font-semibold text-xl my-2">Community</h1>
          <h6>Learners</h6>
          <h6>Parteners</h6>
          <h6>Developers</h6>
          <h6>Transactions</h6>
          <h6>Blog</h6>
          <h6>Teaching Center</h6>
        </div>
        <div>
          <h1 className="font-semibold text-xl my-2">Quick links</h1>
          <h6>Home</h6>
          <h6>Professional Education</h6>
          <h6>Courses</h6>
          <h6>Admissions</h6>
          <h6>Testimonial</h6>
          <h6>Programs</h6>
        </div>
        <div>
          <h1 className="font-semibold text-xl my-2">More</h1>
          <h6>Press</h6>
          <h6>Investors </h6>
          <h6>Terms</h6>
          <h6>Privacy</h6>
          <h6>Help</h6>
          <h6>Contact</h6>
        </div>
      </div>
      <div className="flex justify-between text-sm mt-2">
        <div>Privacy Policy | Terms & Conditions</div>
        <div>All copyright &#169; 2022 Reserved</div>
      </div>
    </div>
  );
};

export default Footer;
