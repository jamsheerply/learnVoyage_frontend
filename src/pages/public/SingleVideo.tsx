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
// }

// const SingleVideo: React.FC = () => {
//   const [video, setVideo] = useState<Video | null>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const { id } = useParams<{ id: string }>();

//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         const response = await axios.get(
//           `http://${import.meta.env.VITE_BASE_URL}/content-management/videos/${id}`
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
//       const videoSrc = `http://${import.meta.env.VITE_BASE_URL}/content-management/videos/stream/${id}`;
//       if (Hls.isSupported()) {
//         const hls = new Hls({
//           maxBufferSize: 0,
//           maxBufferLength: 10,
//           liveSyncDuration: 10,
//           liveMaxLatencyDuration: Infinity,
//         });
//         hls.loadSource(videoSrc);
//         hls.attachMedia(videoRef.current);
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           videoRef.current?.play();
//         });
//       } else if (
//         videoRef.current.canPlayType("application/vnd.apple.mpegurl")
//       ) {
//         videoRef.current.src = videoSrc;
//       }
//     }
//   }, [video, id]);

//   if (!video) return <div>Loading...</div>;

//   return (
//     <div className=" flex justify-center">
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
//     </div>
//   );
// };

// export default SingleVideo;

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";

const SingleVideo: React.FC = () => {
  // const [video, setVideo] = useState<Video | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const { id } = useParams<{ id: string }>();
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // console.log("Fetching video data...");
        // const response = await axios.get(
        //   `http://${import.meta.env.VITE_BASE_URL}/content-management/videos/${id}`
        // );
        // console.log("Video data received:", response.data);
        // setVideo(response.data);

        // Set the stream URL to your backend endpoint
        setStreamUrl(
          `http://${
            import.meta.env.VITE_BASE_URL
          }/content-management/videos/stream/test/${id}`
        );
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    fetchVideo();
  }, [id]);

  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    setProgress(state.played * 100);
    if (state.played >= 0.8 && !videoCompleted) {
      setVideoCompleted(true);
      console.log("Video has reached 80% completion!");
    }

    // Prefetch next chunk when 70% of the current chunk is loaded
    if (state.loaded >= 0.7 && state.loaded < 0.9) {
      prefetchNextChunk();
    }
  };

  const prefetchNextChunk = () => {
    // Calculate the next chunk's start time
    const currentTime = playerRef.current?.getCurrentTime();
    const nextChunkStart = currentTime !== undefined ? currentTime + 30 : 30; // 30 seconds ahead or default to 30 if currentTime is undefined
    const videoElement =
      playerRef.current?.getInternalPlayer() as HTMLVideoElement;
    if (videoElement && "preload" in videoElement) {
      videoElement.preload = "auto";
      videoElement.src = `${streamUrl}#t=${nextChunkStart}`;
    }
  };

  if (!streamUrl) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4">
        <ReactPlayer
          ref={playerRef}
          url={streamUrl}
          controls
          width="100%"
          controlsList="nodownload"
          height="auto"
          onProgress={handleProgress}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
        />
        <div>Progress: {progress.toFixed(2)}%</div>
        {videoCompleted && <div>Video has reached 80% completion!</div>}
      </div>
    </div>
  );
};

export default SingleVideo;
