import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LearnVoyageLoading = ({ onLoadingComplete, onError }) => {
  const [position, setPosition] = useState(0);
  const [apisChecked, setApisChecked] = useState(0);
  const [error, setError] = useState(null);

  const services = [
    {
      name: "Api Gateway",
      url: import.meta.env.VITE_BASE_URL,
    },
    {
      name: "Auth Service",
      url: import.meta.env.VITE_AUTH_URL,
    },
    {
      name: "Chat Service",
      url: import.meta.env.VITE_CHAT_SERVICE_URL,
    },
    {
      name: "Content Management",
      url: import.meta.env.VITE_CONTENT_MANAGEMENT_URL,
    },
    {
      name: "Notifications Service",
      url: import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL,
    },
    {
      name: "Payment Service",
      url: import.meta.env.VITE_PAYMENT_SERVICE_URL,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => (prevPosition === 0 ? 100 : 0));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkApis = async () => {
      for (const service of services) {
        try {
          const response = await axios.get(`${service.url}/`);
          if (response.data.health === true) {
            setApisChecked((prev) => prev + 1);
            console.log(`${service.name} check passed successfully.`);
          } else {
            throw new Error(`${service.name} is not healthy`);
          }
        } catch (error) {
          console.error(`Error checking ${service.name}:`, error);
          const errorMessage = `Error: ${service.name} is not responding or unhealthy`;
          setError(errorMessage);
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          onError(error);
          return;
        }
      }

      console.log("All API checks passed successfully!");
      onLoadingComplete();
    };

    checkApis();
  }, [onLoadingComplete, onError]);

  const progressPercentage = (apisChecked / services.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="relative mb-4">
        <h1 className="text-4xl font-bold text-navy-900">LEARNVOYAGE</h1>
        <motion.div
          className="absolute top-0 right-0 w-8 h-16 bg-navy-900"
          animate={{ x: position }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      {/* <p className="text-lg text-navy-900 mb-4">
        Checking Services: {apisChecked} / {services.length}
      </p> */}
      <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default LearnVoyageLoading;
