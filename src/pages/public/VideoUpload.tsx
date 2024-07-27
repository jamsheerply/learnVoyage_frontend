// import React, { useState, useRef } from "react";
// import axios from "axios";
// const VideoUpload: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState<string | null>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//       setPreview(URL.createObjectURL(e.target.files[0]));
//       setUploadStatus(null);
//     }
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!file) return;
//     setUploading(true);
//     setUploadStatus("Uploading to Cloudinary...");
//     try {
//       // Upload to Cloudinary
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", "videos_preset");
//       const cloudName = import.meta.env.VITE_CLOUD_NAME;
//       formData.append("cloud_name", cloudName);
//       const cloudinaryResponse = await axios.post(
//         `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
//         formData
//       );
//       setUploadStatus(
//         "Cloudinary upload successful. Sending details to backend..."
//       );
//       const { public_id, version } = cloudinaryResponse.data;
//       // Send video details to your backend
//       const response = await axios.post(
//         "http://localhost:3000/api/content-management/videos",
//         {
//           title: file.name,
//           publicId: public_id,
//           version: version.toString(),
//         }
//       );
//       console.log("Video uploaded:", response.data);
//       setUploadStatus("Upload complete. Video saved in database.");
//       // Reset form
//       setFile(null);
//       setPreview(null);
//     } catch (error) {
//       console.error("Error uploading video:", error);
//       setUploadStatus("Error");
//     } finally {
//       setUploading(false);
//     }
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input type="file" accept="video/*" onChange={handleFileChange} />
//         <button type="submit" disabled={!file || uploading}>
//           {uploading ? "Uploading..." : "Upload Video"}
//         </button>
//       </form>
//       {uploadStatus && <p>{uploadStatus}</p>}
//       {preview && (
//         <video ref={videoRef} width="320" height="240" controls>
//           <source src={preview} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       )}
//     </div>
//   );
// };

// export default VideoUpload;

import React, { useState, useRef } from "react";
import axios from "axios";

const VideoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setUploadStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadStatus("Uploading to Cloudinary...");
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "videos_preset");
      const cloudName = import.meta.env.VITE_CLOUD_NAME;
      formData.append("cloud_name", cloudName);
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData
      );
      setUploadStatus(
        "Cloudinary upload successful. Sending details to backend..."
      );
      const { public_id, version } = cloudinaryResponse.data;
      // Send video details to your backend
      const response = await axios.post(
        "http://localhost:3000/api/content-management/videos",
        {
          title: file.name,
          publicId: public_id,
          version: version.toString(),
        }
      );
      console.log("Video uploaded:", response.data);
      setUploadStatus("Upload complete. Video saved in database.");
      // Reset form
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
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
      {preview && (
        <video ref={videoRef} width="320" height="240" controls>
          <source src={preview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoUpload;
