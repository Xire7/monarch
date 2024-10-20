"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import Link from "next/link";
import FileUploadComponent from "./FileUploadComponent";

const UploadCSV = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the submission of multiple files here
    console.log("Submitting files:", selectedFiles);
    // You would typically send these files to your server or process them here
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const backend_url = "54.183.36.99:80";

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
      // Step 1: Get presigned URL from backend
      const presignedUrlResponse = await fetch(
        `http://${backend_url}/upload/getPresignedUrl`,
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
        `http://${backend_url}/upload/notifyComplete`,
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
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto ">
      <h2 className="flex justify-center text-2xl font-bold mb-4 text-gray-800">
        Upload Your CSVs
      </h2>
      <FileUploadComponent />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center p-8">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                Multiple CSV files (max. 10MB each)
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".csv"
              multiple
            />
          </label>
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-center">
          {uploadStatus && <p>{uploadStatus}</p>}
          {resultUrl && (
            <p>
              Processed file available at: <a href={resultUrl}>{resultUrl}</a>
            </p>
          )}
          <Link className="flex flex-row space-x-2" href={"identify"}>
            <button
              onClick={handleFileUpload}
              disabled={selectedFiles.length == 0}
              className={`flex flex-row space-x-4  text-white font-medium py-4 px-4 border-b-4  ${
                selectedFiles.length == 0
                  ? "bg-orange-200 border-orange-400"
                  : "hover:border-orange-400 hover:bg-orange-300  border-orange-600 bg-orange-400"
              } rounded`}
            >
              <p>Upload Data</p>
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UploadCSV;
