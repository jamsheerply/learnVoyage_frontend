// import React, { useState, useEffect, useRef } from "react";
// import ReactPlayer from "react-player";

// interface StreamingVideoProps {
//   publicId: string;
//   version: string;
//   controls: boolean;
//   onDurationSet?: (duration: number) => void;
// }

// const StreamingVideo: React.FC<StreamingVideoProps> = ({
//   publicId,
//   version,
//   controls,
//   onDurationSet,
// }) => {
//   const [streamUrl, setStreamUrl] = useState<string>("");
//   const [progress, setProgress] = useState(0);
//   const [videoCompleted, setVideoCompleted] = useState(false);
//   const playerRef = useRef<ReactPlayer>(null);

//   useEffect(() => {
//     setStreamUrl(
//       `http://${import.meta.env.VITE_BASE_URL}/content-management/videos/stream/${publicId}/${version}`
//     );
//   }, [publicId, version]);

//   const handleProgress = (state: {
//     played: number;
//     playedSeconds: number;
//     loaded: number;
//     loadedSeconds: number;
//   }) => {
//     setProgress(state.played * 100);
//     if (state.played >= 0.8 && !videoCompleted) {
//       setVideoCompleted(true);
//       console.log(state.played);
//       console.log("Video has reached 80% completion!");
//     }

//     if (state.loaded >= 0.7 && state.loaded < 0.9) {
//       prefetchNextChunk();
//     }
//   };

//   const prefetchNextChunk = () => {
//     const currentTime = playerRef.current?.getCurrentTime();
//     const nextChunkStart = currentTime !== undefined ? currentTime + 30 : 30;
//     const videoElement =
//       playerRef.current?.getInternalPlayer() as HTMLVideoElement;
//     if (videoElement && "preload" in videoElement) {
//       videoElement.preload = "auto";
//       videoElement.src = `${streamUrl}#t=${nextChunkStart}`;
//     }
//   };

//   console.log(progress);
//   if (!streamUrl) return <div>Loading...</div>;

//   return (
//     <ReactPlayer
//       ref={playerRef}
//       url={streamUrl}
//       controls={controls}
//       width="100%"
//       controlsList="nodownload"
//       height="auto"
//       onProgress={handleProgress}
//       onDuration={(duration: number) => {
//         if (onDurationSet) {
//           onDurationSet(duration);
//         }
//       }}
//       config={{
//         file: {
//           attributes: {
//             controlsList: "nodownload",
//           },
//         },
//       }}
//     />
//   );
// };

// export default StreamingVideo;

import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

interface StreamingVideoProps {
  publicId: string;
  version: string;
  controls: boolean;
  onDurationSet?: (duration: number) => void;
  onVideoCompleted?: () => void;
}

const StreamingVideo: React.FC<StreamingVideoProps> = ({
  publicId,
  version,
  controls,
  onDurationSet,
  onVideoCompleted,
}) => {
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    setStreamUrl(
      `http://${
        import.meta.env.VITE_BASE_URL
      }/content-management/videos/stream/${publicId}/${version}`
    );
  }, [publicId, version]);

  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    const currentProgress = state.played * 100;
    setProgress(currentProgress);
    console.log("Current progress:", currentProgress);

    if (state.played >= 0.8 && !videoCompleted) {
      setVideoCompleted(true);
      console.log("Video has reached 80% completion!");
      if (onVideoCompleted) {
        onVideoCompleted();
        setVideoCompleted(false);
      }
    }
    if (state.loaded >= 0.7 && state.loaded < 0.9) {
      prefetchNextChunk();
    }
  };

  const prefetchNextChunk = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    const nextChunkStart = currentTime !== undefined ? currentTime + 30 : 30;
    const videoElement =
      playerRef.current?.getInternalPlayer() as HTMLVideoElement;
    if (videoElement && "preload" in videoElement) {
      videoElement.preload = "auto";
      videoElement.src = `${streamUrl}#t=${nextChunkStart}`;
    }
  };

  if (!streamUrl) return <div>Loading...</div>;

  return (
    <ReactPlayer
      ref={playerRef}
      url={streamUrl}
      controls={controls}
      width="100%"
      controlsList="nodownload"
      height="auto"
      onProgress={handleProgress}
      onDuration={(duration: number) => {
        if (onDurationSet) {
          onDurationSet(duration);
        }
      }}
      config={{
        file: {
          attributes: {
            controlsList: "nodownload",
          },
        },
      }}
    />
  );
};

export default StreamingVideo;
