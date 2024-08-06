import Link from "next/link";
import React from "react";

interface PostProp {
    _id: string;
    title: string;
    content: string;
    author: string;
    image: string;
    createdAt: Date;
}

async function fetchPosts(): Promise<PostProp[]> {
    // Use the new fetch options for App Router
    const res = await fetch("http://localhost:3000/api/post", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch posts");
    }

    const data = await res.json();
    return data.posts;
}

export default async function AllPosts() {
    let posts: PostProp[];

    try {
        posts = await fetchPosts();
    } catch (error) {
        console.error("Error fetching posts:", error);
        return <div>Error loading posts</div>;
    }

    if (!posts || posts.length === 0) {
        return <div>No posts available</div>;
    }

    return (
        <div className="content-center">
            <div className="flex flex-col items-center w-full gap-3">
                {posts.map((post) => (
                    <div
                        className="card bg-base-100 w-96 shadow-xl"
                        key={post._id}
                    >
                        {post.image !== "none" && (
                            <figure>
                                <img src={post.image} alt="Post Image" />
                            </figure>
                        )}
                        <div className="card-body">
                            <h2 className="card-title">{post.title}</h2>
                            <p>{post.content}</p>
                            <div className="card-actions justify-end">
                                <button className="btn">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        className="h-6 w-6"
                                    >
                                        <path d="M503.7 189.8L327.7 37.9C312.3 24.5 288 35.3 288 56v80.1C127.4 137.9 0 170.1 0 322.3c0 61.4 39.6 122.3 83.3 154.1 13.7 9.9 33.1-2.5 28.1-18.6C66.1 312.8 132.9 274.3 288 272.1V360c0 20.7 24.3 31.5 39.7 18.2l176-152c11.1-9.6 11.1-26.8 0-36.3z" />
                                    </svg>
                                    Share
                                </button>
                                <Link href={`/post/${post._id}`}>
                                    <button className="btn btn-primary">
                                        Read More
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
