import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LearnVoyageLoading = ({ onLoadingComplete, onError }) => {
  const [apisChecked, setApisChecked] = useState(0);
  const [error, setError] = useState(null);

  const services = [
    { name: "Api Gateway", url: import.meta.env.VITE_API_GATEWAY_URL },
    { name: "Auth Service", url: import.meta.env.VITE_AUTH_URL },
    { name: "Chat Service", url: import.meta.env.VITE_CHAT_SERVICE_URL },
    {
      name: "Content Management",
      url: import.meta.env.VITE_CONTENT_MANAGEMENT_URL,
    },
    {
      name: "Notifications Service",
      url: import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL,
    },
    { name: "Payment Service", url: import.meta.env.VITE_PAYMENT_SERVICE_URL },
  ];

  useEffect(() => {
    const checkApis = async () => {
      // If in production Vercel environment, perform full API checks
      if (import.meta.env.VITE_ENV === "PRODUCTION_VERCEL") {
        try {
          const responses = await Promise.all(
            services?.map((service) =>
              axios
                .get(`${service.url}/`)
                .then((response) => ({
                  name: service.name,
                  health: response.data.health === true,
                }))
                .catch(() => ({
                  name: service.name,
                  health: false,
                }))
            )
          );

          const failedServices = responses.filter(
            (response) => !response.health
          );

          if (failedServices?.length > 0) {
            const errorMessages = failedServices?.map(
              (service) => `${service.name} is not responding or unhealthy`
            );
            setError(errorMessages.join(", "));
            errorMessages.forEach((message) => {
              toast.error(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            });
            onError(new Error(errorMessages.join(", ")));
          } else {
            console.log("All API checks passed successfully!");
            setApisChecked(services?.length);
            onLoadingComplete();
          }
        } catch (error) {
          console.error("Error checking APIs:", error);
          setError("An unexpected error occurred while checking APIs");
          toast.error("An unexpected error occurred while checking APIs", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          onError(error);
        }
      } else {
        // For non-production environments, immediately complete loading
        console.log("Skipping API checks for non-production environment");
        setApisChecked(services?.length);
        onLoadingComplete();
      }
    };

    checkApis();
  }, [onLoadingComplete, onError]);

  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const circleVariants = {
    initial: { scale: 0 },
    animate: {
      scale: [0, 1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold text-green-500 mb-8">LearnVoyage</h1>
      <motion.div
        className="relative w-20 h-20"
        variants={containerVariants}
        animate="animate"
      >
        {[0, 1, 2, 3]?.map((index) => (
          <motion.div
            key={index}
            className="absolute w-4 h-4 bg-green-500 rounded-full"
            style={{
              top: index % 2 === 0 ? 0 : "auto",
              bottom: index % 2 === 1 ? 0 : "auto",
              left: index < 2 ? 0 : "auto",
              right: index >= 2 ? 0 : "auto",
            }}
            variants={circleVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.2 }}
          />
        ))}
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default LearnVoyageLoading;
