"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileCheck, AlertCircle } from "lucide-react";

export default function ToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Simulating file upload and processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsProcessing(false);
    setIsComplete(true);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-orange-500 p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Monarch</h1>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-white hover:text-black">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white hover:text-black">
                About
              </Link>
            </li>
            <li>
              <Link href="/tool" className="text-white hover:text-black">
                Tool
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto mt-16 px-4">
        <h2 className="text-3xl font-bold mb-8">Data Transformation Tool</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <Label htmlFor="csv-upload">Upload your CSV file</Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
          {error && (
            <div className="mb-4 text-red-500 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isProcessing || isComplete}
          >
            {isProcessing ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isComplete ? (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Complete
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Transform Data
              </>
            )}
          </Button>
        </form>
        {isComplete && (
          <div className="mt-8 text-center">
            <p className="text-green-600 mb-4">
              Your data has been successfully transformed!
            </p>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <a href="/path-to-transformed-file.csv" download>
                Download Transformed CSV
              </a>
            </Button>
          </div>
        )}
      </main>

      <footer className="bg-black text-white mt-16 py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Monarch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
