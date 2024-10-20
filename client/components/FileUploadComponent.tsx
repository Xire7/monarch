// FileUploadComponent.tsx

import React, { useState } from "react";

const FileUploadComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");

  // Handle file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    try {
      setUploadStatus("Uploading...");

      // Step 1: Get presigned URL from backend
      const presignedUrlResponse = await fetch(
        `http://${process.env.BACKEND_URL}/upload/getPresignedUrl`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileType: selectedFile.type,
          }),
        }
      );

      const { presignedUrl } = await presignedUrlResponse.json();

      // Step 2: Upload file directly to S3 using presigned URL
      const s3UploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!s3UploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      // Step 3: Notify backend that the upload is complete
      const notifyBackendResponse = await fetch(
        `http://${process.env.BACKEND_URL}/upload/notifyComplete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: selectedFile.name,
          }),
        }
      );

      const notifyBackendResult = await notifyBackendResponse.json();

      if (notifyBackendResponse.ok) {
        setResultUrl(notifyBackendResult.resultS3Url);
        setUploadStatus("Upload complete! File processed successfully.");
      } else {
        throw new Error("Failed to notify backend");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading or processing the file");
    }
  };

  return (
    <div>
      <h2>Upload File to S3</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>

      {uploadStatus && <p>{uploadStatus}</p>}
      {resultUrl && (
        <p>
          Processed file available at: <a href={resultUrl}>{resultUrl}</a>
        </p>
      )}
    </div>
  );
};

export default FileUploadComponent;
