import React, { useState, useRef } from "react";
import axios from "axios";

const VideoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setUploadStatus(null);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadStatus("Uploading to Cloudinary...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "videos_preset");
      const cloudName = import.meta.env.VITE_CLOUD_NAME;
      formData.append("cloud_name", cloudName);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            } else {
              // Handle the case where total is undefined
              console.log("Upload in progress, but total size is unknown");
            }
          },
        }
      );

      setUploadStatus(
        "Cloudinary upload successful. Sending details to backend..."
      );
      const { public_id, version } = cloudinaryResponse.data;

      const response = await axios.post(
        "http://${import.meta.env.VITE_BASE_URL}/content-management/videos",
        {
          title: file.name,
          publicId: public_id,
          version: version.toString(),
        }
      );

      console.log("Video uploaded:", response.data);
      setUploadStatus("Upload complete. Video saved in database.");
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus("Error uploading video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
      {uploadStatus && (
        <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>
      )}
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {uploadProgress}% uploaded
          </p>
        </div>
      )}
      {preview && (
        <video
          ref={videoRef}
          width="100%"
          height="auto"
          controls
          className="mt-4"
        >
          <source src={preview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoUpload;
