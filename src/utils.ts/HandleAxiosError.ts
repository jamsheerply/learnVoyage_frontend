import axios from "axios";

export const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log(error.response.data);
      return error.response.data;
    }
    return error.message;
  } else if (error instanceof Error) {
    console.log(error.message);
    return error.message;
  } else {
    return "An unknown error occurred.";
  }
};
