import React, { useState, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";
import toast from "react-hot-toast";

export interface UploadedFile extends File {
  preview: string;
  url?: string;
}

interface FileUploadProps {
  onFileUploaded: (url: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
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
        return data.secure_url;
      } else {
        throw new Error("Failed to get secure URL from Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image, please try again");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] } as Accept,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} is not an image.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the 5MB limit.`);
        return;
      }

      const preview = URL.createObjectURL(file);
      setUploadedFile({ ...file, preview });

      try {
        const url = await uploadToCloudinary(file);
        setUploadedFile((prevFile) => (prevFile ? { ...prevFile, url } : null));
        onFileUploaded(url);
      } catch (error) {
        // Error is already handled in uploadToCloudinary
      }
    },
  });

  useEffect(() => {
    return () => {
      if (uploadedFile) {
        URL.revokeObjectURL(uploadedFile.preview);
      }
    };
  }, [uploadedFile]);

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded p-6 h-[250px] flex items-center justify-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {!uploadedFile && (
        <p>
          Drag and drop an image file here, or click to select. Size limit is
          5MB.
        </p>
      )}
      {uploadedFile && (
        <div className="flex flex-col items-center">
          <img
            src={uploadedFile.preview}
            alt={uploadedFile.name}
            className="w-full h-auto object-cover max-h-[200px]"
          />
          <p className="mt-2">
            {isUploading ? "Uploading..." : uploadedFile.url ? "" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
