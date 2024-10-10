"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import Image from "next/image";

const ImageToText = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      console.error("No image selected");
    }
  };

  return (
    <div className="container">
      <h1>Image to Text Converter</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {image && (
        <div>
          <Image src={image} alt="uploaded" width={100} height={100} />
          <button onClick={handleConvert} disabled={isLoading}>
            {isLoading ? "Converting..." : "Convert to Text"}
          </button>
        </div>
      )}

      {text && (
        <div>
          <h3>Extracted Text:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default ImageToText;
