import React, { useState, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";
import toast from "react-hot-toast";

export interface UploadedFile extends File {
  preview: string;
}

interface FileUploadProps {
  onFilesAdded: (files: UploadedFile[]) => void;
  progress: { [key: string]: number };
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded, progress }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] } as Accept,
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} is not an image.`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds the 5MB limit.`);
          return false;
        }
        return true;
      });

      const mappedFiles = validFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setUploadedFiles(mappedFiles);
      onFilesAdded(mappedFiles);
    },
  });

  useEffect(() => {
    return () =>
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [uploadedFiles]);

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded p-6 h-[250px] flex items-center justify-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {!uploadedFiles.length && (
        <p>Drag and drop image files here. Size limit is 5MB.</p>
      )}
      <ul className="list-none p-0">
        {uploadedFiles.map((file) => (
          <li key={file.name} className="flex flex-col items-center m-2">
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-auto object-cover"
            />
            <div className="w-full bg-gray-200 h-2 mt-1">
              <div
                className="bg-blue-500 h-2"
                style={{ width: `${progress[file.name] || 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
