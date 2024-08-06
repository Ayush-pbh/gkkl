import Link from "next/link";
import React from "react";
import { Metadata } from "next";
interface PostProp {
    _id: string;
    title: string;
    content: string;
    author: string;
    image: string;
    createdAt: Date;
}
interface Props {
    params: { postid: string };
}

async function fetchPosts(id: string): Promise<PostProp> {
    // Use the new fetch options for App Router
    const res = await fetch(
        "https://gkkl-bog11qku1-ayush-pbhs-projects.vercel.app/api/post/" + id,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch posts");
    }

    const data = await res.json();
    return data;
}

const PostByIdPage = async ({ params: { postid } }: Props) => {
    let post: PostProp;

    try {
        post = await fetchPosts(postid);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return <div>Error loading posts</div>;
    }

    if (!post) {
        return <div>No Data available for -{postid}-</div>;
    }
    return (
        <div className="content-center">
            <div
                className="card bg-base-100 w-full h-auto shadow-xl"
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
                        <Link href={`/`}>
                            <button className="btn btn-primary">Back</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export async function generateMetadata({
    params: { postid },
}: Props): Promise<Metadata> {
    // Fetch some data
    const data = await fetchPosts(postid);

    return {
        openGraph: {
            title: data.title,
            images: `https://gkkl-bog11qku1-ayush-pbhs-projects.vercel.app/api/post/og/${data._id}`,
        },
    };
}
export default PostByIdPage;
