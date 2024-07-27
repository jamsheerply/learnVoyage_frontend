import axios from "axios";

export const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log("Axios response error:", error.response.data);
      return error.response.data;
    }
    return error.message;
  } else if (error instanceof Error) {
    console.log("Generic error:", error.message);
    return error.message;
  } else {
    return "An unknown error occurred.";
  }
};
