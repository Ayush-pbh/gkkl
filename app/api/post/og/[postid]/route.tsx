import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

export async function GET(
    request: NextRequest,
    { params }: { params: { postid: string } }
) {
    await dbConnect();
    async function generateOGImage(
        title: string,
        content: string,
        author: string = "",
        imagePath: string
    ) {
        // Load base image
        const baseImage = sharp(
            path.join(process.cwd(), "public", "1200x630_image.png")
        );

        // Load and resize user image if provided
        // let userImage;
        // if (imagePath) {
        //     userImage = await sharp(imagePath)
        //         .resize(300, 300, { fit: "cover" })
        //         .toBuffer();
        // }

        // Create a text SVG
        const svgImage = `
          <svg width="1200" height="630">
            <style>
              .title { fill: #111; font-size: 60px; font-weight: bold; }
              .content { fill: #444; font-size: 30px; }
            </style>
            <text x="50" y="100" class="title">${title}</text>
            <text x="50" y="200" class="content">${content.substring(
                0,
                100
            )}...</text>
          </svg>
        `;

        // Composite everything together
        let image = baseImage;
        // if (userImage) {
        //     image = image.composite([{ input: userImage, top: 460, left: 50 }]);
        // }
        image = image.composite([
            { input: Buffer.from(svgImage), top: 0, left: 0 },
        ]);

        // Generate output
        return image.png().toBuffer();
    }

    try {
        const post = await Post.findById(params.postid);
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const imageBuffer = await generateOGImage(
            post.title,
            post.content,
            post.author,
            post.image
        );

        // Return the image buffer directly
        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error generating OG image:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
