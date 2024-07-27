import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Video {
  _id: string;
  title: string;
  createdAt: string;
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/content-management/videos"
        );
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div>
      <h2>Uploaded Videos</h2>
      <ul>
        {videos.map((video) => (
          <li key={video._id}>
            <Link to={`/video-streaming/${video._id}`}>{video.title}</Link> -
            Uploaded on {new Date(video.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
