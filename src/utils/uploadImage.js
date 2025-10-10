import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

export const uploadImage = async (imageFile) => {
  if (!imageFile) {
    console.warn("No image file provided for upload.");
    return null;
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data?.url || response.data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw (
      error.response?.data?.message || "Image upload failed. Please try again."
    );
  }
};
