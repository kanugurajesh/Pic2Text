"use client";

import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

const ImageToText = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Converting...");
    } else {
      toast.dismiss();
    }
  }, [isLoading]);

  useEffect(() => {
    toast.dismiss();
    if (text) {
      toast.success("Text extracted successfully");
    }
  });

  const handleButtonClick = () => {
    const fileInput = document.getElementById("file");
    fileInput?.click();
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "converted-text.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file?.name);
    if (file) {
      setImage(URL.createObjectURL(file));
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
    <div className="container flex flex-col gap-10 items-center p-4">
      <Toaster />
      <h1 className="font-bold text-4xl mt-10 tracking-wide leading-6">
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
            className="rounded-md"
          />
        </div>
      )}

      <div className="flex gap-4 items-center">
        <button
          onClick={handleButtonClick}
          className="p-[6px] bg-black text-white flex gap-2 items-center px-4 rounded-full font-bold border-2 border-black"
        >
          <Image
            src="/upload.svg"
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
            className="p-2 bg-black text-white flex gap-2 items-center px-4 rounded-full font-bold"
          >
            <Image
              src="/convert.svg"
              alt="upload"
              width={22}
              height={22}
              className="fill-white"
            />
            <span>{isLoading ? "Converting..." : "Convert to Text"}</span>
          </button>
        )}
      </div>

      {text && (
        <code className="shadow-sm p-5 rounded-md shadow-gray-600 flex flex-col gap-4 items-center">
          <span className="font-extrabold text-lg">Converted Text</span>
          <span>{text}</span>
          <button
            className="bg-black p-2 px-4 rounded-md text-white flex gap-2 items-center"
            onClick={handleDownloadText}
          >
            <Image src="/download.svg" alt="download" width={22} height={22} />
            <span>Download</span>
          </button>
        </code>
      )}
    </div>
  );
};

export default ImageToText;
