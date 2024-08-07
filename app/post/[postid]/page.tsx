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
        "https://gkkl-ayush-pbhs-projects.vercel.app/api/post/" + id,
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
            description: data.content.substring(0, 100),
            images: `https://gkkl-ayush-pbhs-projects.vercel.app/api/post/og/${data._id}`,
        },
        twitter: {
            card: "summary",
            site: "@ayushthought",
            creator: "@ayushthought",
            creatorId: "@ayushthought",
            description: data.content.substring(0, 100),
            images: `https://gkkl-ayush-pbhs-projects.vercel.app/api/post/og/${data._id}`,
            title: data.title,
        },
    };
}
export default PostByIdPage;
