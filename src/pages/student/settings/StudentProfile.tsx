import React, { useState, useRef, useEffect } from "react";
import InputProfile from "../../../components/public/profile/InputProfile";
import InputProfile2 from "../../../components/public/profile/InputProfileSecond";
import profileImg from "../../../assets/profilePic.svg";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { CustomError } from "@/utils.ts/customError";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getProfileById, updateProfile } from "@/store/profile/profileActions";
import { userProfileEntity } from "@/types/userProfileEntity";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profession: string;
  password: string;
  confirmPassword: string;
  instagram: string;
  linkedIn: string;
  github: string;
  profilePicture: string;
};

const schema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(25, "First name must be less than 25 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(25, "Last name must be less than 25 characters"),
  phoneNumber: Yup.string()
    .nullable()
    .matches(/^[0-9]*$/, "Phone number must be numeric")
    .notRequired(),
  profession: Yup.string().notRequired(),
  password: Yup.string().test(
    "password",
    "Password must be at least 8 characters and less than 25 characters",
    (value) => !value || (value.length >= 8 && value.length <= 25)
  ),
  confirmPassword: Yup.string().test(
    "confirmPassword",
    "Passwords must match",
    function (value) {
      const { password } = this.parent;
      return !password || value === password;
    }
  ),
  instagram: Yup.string().url("Invalid URL").notRequired(),
  linkedIn: Yup.string().url("Invalid URL").notRequired(),
  github: Yup.string().url("Invalid URL").notRequired(),
});

const StudentProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.profile);
  const { userId } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profession: "",
    password: "",
    confirmPassword: "",
    instagram: "",
    linkedIn: "",
    github: "",
    profilePicture: profileImg,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await dispatch(getProfileById(userId));
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.contact?.phone || "",
        profession: user.profession || "",
        password: "",
        confirmPassword: "",
        instagram: user.contact?.socialMedia?.instagram || "",
        linkedIn: user.contact?.socialMedia?.linkedIn || "",
        github: user.contact?.socialMedia?.github || "",
        profilePicture: user.profile?.avatar || profileImg,
      });
      setHasChanges(false);
    }
  }, [user]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_UPLOAD_PRESET as string
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          setFormData((prevState) => ({
            ...prevState,
            profilePicture: data.secure_url,
          }));
          setHasChanges(true);
        }
      } catch (error) {
        const err = error as CustomError;
        console.error("Error uploading image:", err?.message);
        toast.error("Failed to upload profile image, try again");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasChanges) {
      toast.error("No changes made to save.");
      return;
    }

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      const newFormData: Partial<userProfileEntity> = {
        profile: {
          avatar: formData.profilePicture,
        },
        contact: {
          socialMedia: {
            instagram: formData.instagram,
            linkedIn: formData.linkedIn,
            github: formData.github,
          },
          phone: formData.phoneNumber,
        },
        _id: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        profession: formData.profession,
      };

      if (formData.password) {
        newFormData.password = formData.password;
      }

      await dispatch(updateProfile(newFormData as userProfileEntity));

      toast.success("Profile updated successfully!");
      setHasChanges(false);
    } catch (validationErrors: any) {
      const newErrors: Partial<FormData> = {};
      validationErrors.inner.forEach((error: any) => {
        newErrors[error.path as keyof FormData] = error.message;
      });
      setErrors(newErrors);
      toast.error("Please correct the errors in the form");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-[10%] w-[80%]">
      <div className="p-2">Generals</div>
      <div className="flex flex-col lg:flex-row justify-center lg:gap-5">
        <div className="w-full lg:w-[80%]">
          <div className="flex flex-col lg:flex-row gap-5">
            <span className="w-full lg:w-1/2">
              <InputProfile
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                errorMsg={errors.firstName}
              />
            </span>
            <span className="w-full lg:w-1/2">
              <InputProfile
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                errorMsg={errors.lastName}
              />
            </span>
          </div>
          <div className="flex flex-col lg:flex-row gap-5">
            <span className="w-full lg:w-1/2">
              <InputProfile
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                errorMsg={errors.email}
                disabled
              />
            </span>
            <span className="w-full lg:w-1/2">
              <InputProfile
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                errorMsg={errors.phoneNumber}
              />
            </span>
          </div>
          <div className="flex flex-col lg:flex-row gap-5">
            <span className="w-full lg:w-1/2">
              <InputProfile
                type="text"
                name="profession"
                placeholder="Profession"
                value={formData.profession}
                onChange={handleInputChange}
                errorMsg={errors.profession}
              />
            </span>
          </div>
          <div className="flex flex-col lg:flex-row gap-5">
            <span className="w-full lg:w-1/2">
              <InputProfile
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                errorMsg={errors.password}
              />
            </span>
            <span className="w-full lg:w-1/2">
              <InputProfile
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                errorMsg={errors.confirmPassword}
              />
            </span>
          </div>
        </div>
        <div className="w-full lg:w-[20%] flex justify-center items-center flex-col mt-6 lg:mt-0">
          <div
            className="h-[200px] w-[200px] bg-green-200 cursor-pointer rounded-md overflow-hidden relative"
            onClick={handleProfilePictureClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                Uploading...
              </div>
            )}
            <img
              src={formData.profilePicture}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>
        </div>
      </div>
      <div className="p-2 mt-6">Online Presence</div>
      <div className="flex flex-col gap-5 w-full lg:w-[80%]">
        <div className="flex flex-col lg:flex-row gap-5">
          <span className="w-full lg:w-1/3">
            <InputProfile2
              type="text"
              name="instagram"
              placeholder="Instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              errorMsg={errors.instagram}
            />
          </span>
          <span className="w-full lg:w-1/3">
            <InputProfile2
              type="text"
              name="linkedIn"
              placeholder="LinkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
              errorMsg={errors.linkedIn}
            />
          </span>
          <span className="w-full lg:w-1/3">
            <InputProfile2
              type="text"
              name="github"
              placeholder="GitHub"
              value={formData.github}
              onChange={handleInputChange}
              errorMsg={errors.github}
            />
          </span>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className={`p-3 mx-2 border rounded-lg w-[150px] ${
            hasChanges ? "bg-green-500" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!hasChanges || isUploading}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default StudentProfile;
