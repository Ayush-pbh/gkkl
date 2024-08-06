import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";

import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

interface CreatePostBody {
    title: string;
    content: string;
    username?: string;
}
// Multer Configuration
const upload = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            const uploadDir = path.join(process.cwd(), "uploads");
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
});

// Upload Handler
const handler = upload.single("postImage");

export async function GET(request: NextRequest) {
    // This Route is used to get all posts from the data base
    await dbConnect();

    try {
        const posts = await Post.find({});
        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const body = await request.json();
        const { postTitle, postContent, postAuthor, postImage } = body;

        if (!postTitle || !postContent) {
            return NextResponse.json({
                error: "Post Title & Post Content are required",
            });
        }

        if (postTitle.length < 3 || postContent.length < 3) {
            return NextResponse.json({
                error: "Post Title Or Post Content Minimum Length is 3",
            });
        }

        // Creating a new post
        const newPost = new Post({
            title: postTitle,
            content: postContent,
            image: postImage,
            author: postAuthor || "Unknown",
        });

        await newPost.save();

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server Error", error },
            { status: 500 }
        );
    }
}
