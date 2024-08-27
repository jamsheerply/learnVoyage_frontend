import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

interface VideoPlayerProps {
  publicId: string;
  version: string;
  controls: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  publicId,
  version,
  controls,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    const loadStart = () => {
      fetchVideoChunk(0);
    };

    const onTimeUpdate = () => {
      if (videoElement) {
        const currentTime = videoElement.currentTime;
        const bufferedEnd = getBufferedEnd();
        if (bufferedEnd - currentTime < 10) {
          // If less than 10 seconds ahead is buffered
          fetchVideoChunk(bufferedEnd);
        }
      }
    };

    const getBufferedEnd = () => {
      if (videoElement && videoElement.buffered.length > 0) {
        return videoElement.buffered.end(videoElement.buffered.length - 1);
      }
      return 0;
    };

    if (videoElement) {
      videoElement.addEventListener("loadstart", loadStart);
      videoElement.addEventListener("timeupdate", onTimeUpdate);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadstart", loadStart);
        videoElement.removeEventListener("timeupdate", onTimeUpdate);
      }
    };
  }, []);

  const fetchVideoChunk = async (start: number) => {
    if (!videoRef.current) return;

    try {
      const response = await axios.get(
        `/api/content-management/videos/stream/${publicId}/${version}`,
        {
          headers: {
            Range: `bytes=${start}-`,
          },
          responseType: "blob",
        }
      );

      const videoBlob = new Blob([response.data], { type: "video/mp4" });
      const newVideoUrl = URL.createObjectURL(videoBlob);

      if (!videoUrl) {
        setVideoUrl(newVideoUrl);
      } else {
        const currentTime = videoRef.current.currentTime;
        videoRef.current.src = newVideoUrl;
        videoRef.current.currentTime = currentTime;
      }
    } catch (error) {
      console.error("Error fetching video chunk:", error);
    }
  };

  return (
    <video
      ref={videoRef}
      src={videoUrl || undefined}
      controls={controls}
      className="w-full h-auto"
      playsInline
    />
  );
};

export default VideoPlayer;
