"use client";

import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import Image from "next/image";
import toast from "react-hot-toast";
import Toggle from "@/components/toggle";
import { useTheme } from "next-themes";

const ImageToText = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageClick, setImageClick] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Converting...");
    } else {
      toast.dismiss();
    }
  }, [isLoading]);

  useEffect(() => {
    if (text) {
      toast.dismiss();
      toast.success("Text extracted successfully");
    }
  }, [text]);

  const handleButtonClick = () => {
    const fileInput = document.getElementById("file");
    fileInput?.click();
  };

  const handleResetApp = () => {
    setImage(null);
    setText("");
    toast.success("App reset successfully");
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "converted-text.txt";
    document.body.appendChild(element);
    element.click();

    // Remove the element
    document.body.removeChild(element);

    // Show success message
    toast.success("Text downloaded successfully");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      toast.success("Image uploaded successfully");
    }
  };

  const handleConvert = () => {
    setIsLoading(true);
    if (image) {
      Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m), // Log progress
      })
        .then(({ data: { text } }) => {
          setText(text);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      toast.error("No image selected");
    }
  };

  return (
    <main className="relative">
      <div className="absolute top-4 right-4">
        <Toggle />
      </div>
      {imageClick && image && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setImageClick(false)}
        >
          <Image
            src={image as string}
            alt="uploaded"
            width={300}
            height={300}
            className="rounded-md shadow-sm shadow-gray-600 dark:shadow-white cursor-pointer min-w-[60vw] min-h-[60vh]"
          />
        </div>
      )}
      <div className="flex flex-col gap-10 items-center min-h-screen dark:bg-black dark:text-white p-4">
        <h1 className="font-bold text-4xl tracking-wide leading-6">
          Pic2Text
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          onClick={() => setText("")}
          className="hidden"
          id="file"
        />

        {image && (
          <div className="flex flex-col gap-4 items-center">
            <Image
              src={image}
              alt="uploaded"
              width={300}
              height={300}
              className="rounded-md shadow-sm shadow-gray-600 dark:shadow-white cursor-pointer"
              onClick={() => setImageClick(true)}
            />
          </div>
        )}

        <div className="flex flex-col gap-4 items-center min-[440px]:flex-row">
          <button
            onClick={handleButtonClick}
            className="p-2 bg-black text-white dark:bg-white dark:text-black flex gap-2 items-center px-4 rounded-full font-bold border-2 border-black"
          >
            <Image
              src={theme === "dark" ? "/upload-dark.svg" : "/upload.svg"}
              alt="upload"
              width={25}
              height={25}
              className="fill-white"
            />
            <span>{image ? "Change Image" : "Upload Image"}</span>
          </button>
          {image && (
            <button
              onClick={handleConvert}
              disabled={isLoading}
              className={`p-[10px] bg-black text-white dark:bg-white dark:text-black flex gap-2 items-center px-4 rounded-full font-bold ${
                isLoading && "cursor-wait"
              }`}
            >
              <Image
                src={theme === "dark" ? "/convert-dark.svg" : "/convert.svg"}
                alt="upload"
                width={22}
                height={22}
                className="fill-white"
              />
              <span>{isLoading ? "Converting ..." : "Convert to Text"}</span>
            </button>
          )}
        </div>

        {text && (
          <code className="shadow-sm p-5 rounded-md shadow-gray-600 dark:shadow-white flex flex-col gap-4 items-center">
            <span className="font-extrabold text-lg">Converted Text</span>
            <span>{text}</span>
            <div className="flex gap-4">
              <button
                className="bg-black p-2 px-4 rounded-md text-white dark:bg-white dark:text-black font-semibold flex gap-2 items-center"
                onClick={handleDownloadText}
              >
                <Image
                  src={
                    theme === "dark" ? "/download-dark.svg" : "/download.svg"
                  }
                  alt="download"
                  width={22}
                  height={22}
                />
                <span>Download</span>
              </button>
              <button
                className="bg-black p-2 px-4 rounded-md text-white dark:bg-white dark:text-black font-semibold flex gap-2 items-center"
                onClick={handleResetApp}
              >
                <Image
                  src={theme === "dark" ? "/reset-dark.svg" : "/reset.svg"}
                  alt="reset"
                  width={20}
                  height={20}
                />
                <span>Reset App</span>
              </button>
            </div>
          </code>
        )}
      </div>
    </main>
  );
};

export default ImageToText;
