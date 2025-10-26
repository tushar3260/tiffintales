// src/utils/cloudinaryUpload.js

/**
 * Uploads a file to Cloudinary using unsigned upload
 * @param {File} file - The file object from input[type="file"]
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export const uploadToCloudinary = async (file) => {
  // Get credentials from environment variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Validate environment variables
  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary credentials missing. Check your .env file."
    );
  }

  // Validate file
  if (!file) {
    throw new Error("No file provided");
  }

  // Check file size (10MB limit for free tier - adjust as needed)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error("File size exceeds 10MB limit");
  }

  // Validate file type
  const allowedTypes = [
    "image/jpeg",
    "image/jpg", 
    "image/png",
    "image/webp",
    "application/pdf"
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("File type not supported. Use JPG, PNG, WEBP, or PDF");
  }

  try {
    // Create FormData object (required for file uploads)
    const formData = new FormData();
    formData.append("file", file); // The actual file
    formData.append("upload_preset", uploadPreset); // Your unsigned preset
    formData.append("cloud_name", cloudName); // Your cloud name

    // Optional: Add a folder to organize uploads
    formData.append("folder", "chef_documents");

    // Cloudinary upload endpoint for unsigned uploads
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    // Upload the file
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    // Check if upload was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    // Parse the response
    const data = await response.json();

    // Return the secure URL (HTTPS CDN link)
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

/**
 * Uploads multiple files to Cloudinary
 * @param {FileList | File[]} files - Array of files or FileList object
 * @returns {Promise<string[]>} - Array of secure URLs
 */
export const uploadMultipleToCloudinary = async (files) => {
  // Convert FileList to Array if needed
  const fileArray = Array.from(files);

  // Upload all files in parallel using Promise.all
  const uploadPromises = fileArray.map((file) => uploadToCloudinary(file));

  // Wait for all uploads to complete
  const urls = await Promise.all(uploadPromises);

  return urls;
};