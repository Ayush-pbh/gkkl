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
    const res = await fetch(
        "https://gkkl-ayush-pbhs-projects.vercel.app/api/post/",
        {
            cache: "no-store",
        }
    );

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
                            <p>
                                {post.content.length <= 250
                                    ? post.content.length
                                    : post.content.substring(0, 251) + "..."}
                            </p>

                            <div className="card-actions justify-end">
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
