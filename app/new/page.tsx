import Link from "next/link";
import React from "react";
import NewPostForm from "../components/NewPostForm/NewPostForm";

const NewPostPage = () => {
    return (
        <div className="content-center flex flex-col">
            <div className="flex justify-between items-center h-10">
                <h1 className="text-3xl font-bold">Create New Post</h1>
                <button className="btn btn-outline">Randomize</button>
            </div>
            <NewPostForm />
            <br />
            <br />
        </div>
    );
};

export default NewPostPage;
