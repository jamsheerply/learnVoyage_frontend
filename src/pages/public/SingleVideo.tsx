// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// interface Video {
//   _id: string;
//   title: string;
//   publicId: string;
//   version: string;
//   createdAt: string;
// }

// const SingleVideo: React.FC = () => {
//   const [video, setVideo] = useState<Video | null>(null);
//   const { id } = useParams<{ id: string }>();

//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/content-management/videos/${id}`
//         );
//         setVideo(response.data);
//       } catch (error) {
//         console.error("Error fetching video:", error);
//       }
//     };
//     fetchVideo();
//   }, [id]);

//   if (!video) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>{video.title}</h2>
//       <video
//         controls
//         width="50%"
//         height="50%"
//         controlsList="nodownload"
//         onError={(e) => console.error("Video error:", e)}
//       >
//         <source
//           src={`http://localhost:3000/api/content-management/videos/stream/${video._id}`}
//           type="video/mp4"
//         />
//         Your browser does not support the video tag.
//       </video>
//       <p>Uploaded on: {new Date(video.createdAt).toLocaleString()}</p>
//     </div>
//   );
// };
// export default SingleVideo;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// interface Video {
//   _id: string;
//   title: string;
//   publicId: string;
//   version: string;
//   createdAt: string;
// }

// const SingleVideo: React.FC = () => {
//   const [video, setVideo] = useState<Video | null>(null);
//   const [videoUrl, setVideoUrl] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const { id } = useParams<{ id: string }>();

//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/content-management/videos/${id}`
//         );
//         setVideo(response.data);

//         const urlResponse = await axios.get(
//           `http://localhost:3000/api/content-management/videos/stream/${id}`
//         );
//         setVideoUrl(urlResponse.data.url);
//       } catch (error) {
//         console.error("Error fetching video:", error);
//         setError("Failed to load video. Please try again later.");
//       }
//     };
//     fetchVideo();
//   }, [id]);

//   if (error) return <div>{error}</div>;
//   if (!video || !videoUrl) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>{video.title}</h2>
//       <video
//         controls
//         width="100%"
//         onError={(e) => console.error("Video error:", e)}
//       >
//         <source src={videoUrl} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <p>Uploaded on: {new Date(video.createdAt).toLocaleString()}</p>
//     </div>
//   );
// };

// export default SingleVideo;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Hls from "hls.js";

interface Video {
  _id: string;
  title: string;
  publicId: string;
  version: string;
  createdAt: string;
}

const SingleVideo: React.FC = () => {
  const [video, setVideo] = useState<Video | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/content-management/videos/${id}`
        );
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (video && videoRef.current) {
      const videoSrc = `http://localhost:3000/api/content-management/videos/stream/${id}`;
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferSize: 0,
          maxBufferLength: 30,
          liveSyncDuration: 30,
          liveMaxLatencyDuration: Infinity,
        });
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play();
        });
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = videoSrc;
      }
    }
  }, [video, id]);

  if (!video) return <div>Loading...</div>;

  return (
    <div>
      <h2>{video.title}</h2>
      <video
        ref={videoRef}
        controls
        width="50%"
        height="50%"
        controlsList="nodownload"
        onError={(e) => console.error("Video error:", e)}
      />
      <p>Uploaded on: {new Date(video.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default SingleVideo;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import Hls from "hls.js";

// interface Video {
//   _id: string;
//   title: string;
//   publicId: string;
//   version: string;
//   createdAt: string;
//   adaptiveStreamingUrl: string;
// }

// const SingleVideo: React.FC = () => {
//   const [video, setVideo] = useState<Video | null>(null);
//   const [currentQuality, setCurrentQuality] = useState<string>("auto");
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   const { id } = useParams<{ id: string }>();

//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/content-management/videos/${id}`
//         );
//         setVideo(response.data);
//       } catch (error) {
//         console.error("Error fetching video:", error);
//       }
//     };
//     fetchVideo();
//   }, [id]);

//   useEffect(() => {
//     if (video && videoRef.current) {
//       const videoSrc = video.adaptiveStreamingUrl;

//       if (Hls.isSupported()) {
//         hlsRef.current = new Hls({
//           maxBufferSize: 0,
//           maxBufferLength: 30,
//           enableWorker: true,
//         });
//         hlsRef.current.loadSource(videoSrc);
//         hlsRef.current.attachMedia(videoRef.current);

//         hlsRef.current.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
//           const availableQualities = data.levels.map((l) => l.height);
//           console.log("Available qualities:", availableQualities);
//         });
//       } else if (
//         videoRef.current.canPlayType("application/vnd.apple.mpegurl")
//       ) {
//         videoRef.current.src = videoSrc;
//       }
//     }

//     return () => {
//       if (hlsRef.current) {
//         hlsRef.current.destroy();
//       }
//     };
//   }, [video]);

//   const handleQualityChange = (quality: string) => {
//     if (hlsRef.current) {
//       if (quality === "auto") {
//         hlsRef.current.currentLevel = -1;
//       } else {
//         const levels = hlsRef.current.levels;
//         const level = levels.findIndex((l) => l.height.toString() === quality);
//         hlsRef.current.currentLevel = level;
//       }
//       setCurrentQuality(quality);
//     }
//   };

//   if (!video) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>{video.title}</h2>
//       <video
//         ref={videoRef}
//         controls
//         width="50%"
//         height="50%"
//         controlsList="nodownload"
//         onError={(e) => console.error("Video error:", e)}
//       />
//       <p>Uploaded on: {new Date(video.createdAt).toLocaleString()}</p>
//       <div>
//         <label>Quality: </label>
//         <select
//           value={currentQuality}
//           onChange={(e) => handleQualityChange(e.target.value)}
//         >
//           <option value="auto">Auto</option>
//           {hlsRef.current?.levels.map((level) => (
//             <option key={level.height} value={level.height.toString()}>
//               {level.height}p
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default SingleVideo;
