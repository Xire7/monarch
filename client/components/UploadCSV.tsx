"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UploadCSV = () => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [readyToNotify, setReadyToNotify] = useState<boolean[]>([]);
  const [resultData, setResultData] = useState(null);

  const getFileNames = () => {
    var fileNames = [];
    for (var file in selectedFiles) {
      fileNames.push(selectedFiles[file].name);
    }
    return fileNames;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

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
    for (var i = 0; i < selectedFiles.length; ++i) {
      handleFileUpload(selectedFiles[i], i);
    }
    notifyModel();
  };

  // Fetch the result data from the PreSigned URL
  const fetchResultData = async (url: string) => {
    try {
      console.log("Fetching data from URL:", url);
      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        console.log("Response not OK. Status Text:", response.statusText);
        throw new Error(
          `Failed to fetch presigned result data: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      setResultData(data);

      // Store the data in session storage
      sessionStorage.setItem("schemaData", JSON.stringify(data));

      // Redirect to the schema page
      router.push("/schema");
    } catch (error) {
      console.error("Error fetching result data:", error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (selectedFile: any, number: number) => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
    try {
      setUploadStatus("Uploading...");
      setReadyToNotify((prev) => {
        return [...prev, false];
      });

      // console.log(selectedFile);
      // Step 1: Get presigned URL from backend
      const presignedUrlResponse = await fetch(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/getPresignedUrl`,
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
      } else {
        setUploadStatus(
          "Upload complete! File uploaded successfully. Now processing..."
        );
        setReadyToNotify((prev) => {
          let newNotify = prev;
          newNotify[number] = true;
          return newNotify;
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error processing the file");
    }
  };

  const notifyModel = async () => {
    try {
      const notifyBackendResponse = await fetch(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/notifyModel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileNames: getFileNames(),
          }),
        }
      );

      if (!readyToNotify.includes(false)) {
        const notifyBackendResult = await notifyBackendResponse.json();

        if (notifyBackendResponse.ok) {
          console.log(
            "Notify backend successful. Result:",
            notifyBackendResult
          );
          setResultUrl(notifyBackendResult.presignedUrl);
          setUploadStatus(
            "File processed successfully. Fetching result data..."
          );
          await fetchResultData(notifyBackendResult.presignedUrl);
        } else {
          console.error(
            "Notify backend failed. Status:",
            notifyBackendResponse.status
          );
          throw new Error(
            `Failed to notify backend: ${notifyBackendResponse.statusText}`
          );
        }
      } else {
        console.warn("Not all files are ready to notify.");
      }
    } catch (error) {
      console.error("Error in notifyModel:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
      <h2 className="flex justify-center text-2xl font-bold mb-4 text-gray-800">
        Upload Your CSVs
      </h2>

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
                At least 2 CSV files (max. 10MB each)
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
        <div className="flex flex-col justify-center">
          {/* <Link className="flex flex-row space-x-2" href={"identify"}> */}
          {uploadStatus && (
            <div
              className="mt-2 mb-6 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-sm"
              role="alert"
            >
              <p className="font-bold">Status</p>
              <p>{uploadStatus}</p>
            </div>
          )}
          {resultUrl && (
            <p>
              Processed file available at:
              <a href={resultUrl}>{resultUrl}</a>
            </p>
          )}
          <button
            disabled={selectedFiles.length < 2}
            className={`flex flex-row space-x-4  text-white font-medium py-4 px-4 border-b-4 justify-center  ${
              selectedFiles.length < 2
                ? "bg-orange-200 border-orange-400"
                : "hover:border-orange-400 hover:bg-orange-300  border-orange-600 bg-orange-400"
            } rounded`}
          >
            <p>Upload Data</p>
          </button>
          {/* </Link> */}
        </div>
      </form>
    </div>
  );
};

export default UploadCSV;
