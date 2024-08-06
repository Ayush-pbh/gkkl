"use client";
import React, { FormEvent, useRef, useState } from "react";
import uploadImageDummy from "../../../public/upload_image_dummy.jpg";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
interface CloudinaryUploadWidgetInfo {
    event: string;
    info: {
        secure_url: string;
        // add other properties if necessary
    };
}
const NewPostForm = () => {
    // States
    const [image, setImage] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("none");
    // Refs
    const postTitleRef = useRef<HTMLInputElement>(null);
    const postContentRef = useRef<HTMLTextAreaElement>(null);
    const postAuthorRef = useRef<HTMLInputElement>(null);

    // Functions
    const handleImageUpload = () => {};

    const handlePostCreation = async () => {
        const data = {
            postTitle: postTitleRef.current?.value,
            postContent: postContentRef.current?.value,
            postAuthor: postAuthorRef.current?.value,
            postImage: uploadedImageUrl,
        };
        const resp = await axios
            .post("/api/post", data)
            .catch((err) => console.log(err));
        console.log(resp);
    };

    return (
        <div className="mt-10">
            <div className="flex flex-col items-center justify-center">
                <div className="form-control w-full max-w-xl">
                    <div className="label">
                        <span className="label-text">Post Title</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Catchy Post Title here!"
                        className="input input-bordered w-full "
                        ref={postTitleRef}
                    />
                </div>

                <div className="form-control w-full max-w-xl mt-6">
                    <div className="label">
                        <span className="label-text">Post Author</span>
                        <span className="label-text-alt badge badge-info">
                            optional
                        </span>
                    </div>
                    <input
                        type="text"
                        placeholder="@Author"
                        className="input input-bordered w-full "
                        ref={postAuthorRef}
                    />
                </div>
                <div className="form-control w-full max-w-xl mt-6">
                    <div className="label">
                        <div className="label-text">Post Content</div>
                    </div>
                    <textarea
                        className="textarea textarea-bordered p-5"
                        placeholder="You amazing story goes here!"
                        ref={postContentRef}
                    ></textarea>
                </div>
                <div className="form-control w-full max-w-xl mt-6">
                    <div className="label">
                        <div className="label-text">Attach Image</div>
                        <span className="label-text-alt badge badge-info">
                            optional
                        </span>
                    </div>
                    <CldUploadWidget
                        uploadPreset="iphtup80"
                        onSuccess={(result) => {
                            if (
                                result.event == "success" &&
                                typeof result.info === "object"
                            ) {
                                console.log("Upload Done!");
                                setUploadedImageUrl(result.info.secure_url);
                            }
                        }}
                    >
                        {({ open }) => {
                            return (
                                <button
                                    className="btn btn-solid btn-secondary btn-outline"
                                    onClick={() => open()}
                                >
                                    Upload
                                </button>
                            );
                        }}
                    </CldUploadWidget>
                </div>
                <div className="form-control w-full max-w-xl mt-6 flex">
                    <button
                        className="btn btn-solid btn-primary "
                        onClick={() => {
                            handlePostCreation();
                        }}
                    >
                        Create Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewPostForm;
