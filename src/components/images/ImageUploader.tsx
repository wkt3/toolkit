"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRef } from "react";

const ImageUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File>();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    try {
      const data = new FormData();
      data.set("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <main className="flex flex-col items-center justify-center w-full h-full mt-10">
        <form onSubmit={onSubmit}>
          <div
            onClick={handleImageClick}
            className="flex flex-col items-center justify-self-center cursor-pointer max-w-[300px] max-h-[300px] border-border border-black-[2px]"
          >
            {image ? (
              <>
                <Image
                  src={image}
                  alt="uploaded"
                  width={500}
                  height={500}
                  priority
                  layout="responsive"
                />
              </>
            ) : (
              <>
                <Image
                  src="/empty.jpg"
                  alt="empty.icon"
                  width={100}
                  height={100}
                />
              </>
            )}
            <Input
              className="hidden"
              type="file"
              name="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Input
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </div>
          <div className="flex flex-col items-center justify-self-center w-full h-full mt-[50px]">
            {image ? (
              <>
                <Button className="mt-10" variant={"default"} size={"default"}>
                  Submit
                </Button>
              </>
            ) : (
              <>
                <p>Please Upload Image to display </p>
              </>
            )}
          </div>
      </form>
      <div className="">
        
      </div>
    </main>
  );
};

export default ImageUploader;
