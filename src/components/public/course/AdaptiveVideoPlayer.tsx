import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const AdaptiveVideoPlayer: React.FC<{ publicId: string; version: string }> = ({
  publicId,
  version,
}) => {
  console.log(version, publicId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [networkSpeed, setNetworkSpeed] = useState<number>(1000000); // Default to 1 Mbps

  useEffect(() => {
    const measureNetworkSpeed = async () => {
      const startTime = Date.now();
      const response = await fetch("/path/to/small/file");
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const fileSizeInBits = (await response.blob()).size * 8;
      const speedBps = fileSizeInBits / duration;
      setNetworkSpeed(speedBps);
    };

    measureNetworkSpeed();
    const interval = setInterval(measureNetworkSpeed, 30000); // Measure every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadstart", loadStart);
      videoRef.current.addEventListener("progress", onProgress);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadstart", loadStart);
        videoRef.current.removeEventListener("progress", onProgress);
      }
    };
  }, []);

  const loadStart = () => {
    if (videoRef.current && videoRef.current.buffered.length === 0) {
      fetchVideoChunk(0);
    }
  };

  const onProgress = () => {
    if (videoRef.current) {
      const buffered = videoRef.current.buffered;
      if (buffered.length > 0) {
        const lastBufferedEnd = buffered.end(buffered.length - 1);
        if (videoRef.current.currentTime + 10 > lastBufferedEnd) {
          fetchVideoChunk(lastBufferedEnd);
        }
      }
    }
  };

  const fetchVideoChunk = async (start: number) => {
    if (!videoRef.current) return;

    const chunk = 10 ** 6; // 1MB chunk size
    const end = start + chunk;

    try {
      const response = await axios.get(
        `/api/content-management/videos/stream/${publicId}/${version}`,
        {
          headers: {
            Range: `bytes=${start}-${end}`,
            "X-Network-Speed": networkSpeed.toString(),
          },
          responseType: "arraybuffer",
        }
      );

      const videoBlob = new Blob([response.data], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);

      if (!videoRef.current.src) {
        videoRef.current.src = videoUrl;
      } else {
        const mediaSource = new MediaSource();
        mediaSource.addEventListener("sourceopen", () => {
          const sourceBuffer = mediaSource.addSourceBuffer("video/mp4");
          sourceBuffer.appendBuffer(response.data);
        });
        videoRef.current.src = URL.createObjectURL(mediaSource);
      }
    } catch (error) {
      console.error("Error fetching video chunk:", error);
    }
  };

  return (
    <video ref={videoRef} controls className="w-full h-auto" playsInline />
  );
};

export default AdaptiveVideoPlayer;
