import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { postid: string } }
) {
    await dbConnect();
    try {
        const post = await Post.findById(params.postid);

        if (!post) {
            return NextResponse.json({ error: "Post not found" });
        }
        return NextResponse.json(post);
    } catch (error) {
        NextResponse.json({ error: "Server Error" });
    }
}
