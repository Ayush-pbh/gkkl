import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";
import { promises as fs } from "fs";

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
        try {
            const fontPath = path.join(process.cwd(), "public", "boska.ttf");

            // Load base image
            const baseImage = sharp(
                path.join(process.cwd(), "public", "1200x630_image.png")
            );

            // Load and resize user image if provided
            let userImage;
            if (imagePath !== "none") {
                try {
                    const response = await fetch(imagePath);
                    if (!response.ok) throw new Error("Failed to fetch image");
                    const arrayBuffer = await response.arrayBuffer();
                    const imageBuffer = Buffer.from(arrayBuffer);
                    userImage = await sharp(imageBuffer)
                        .resize(300, 300, { fit: "cover" })
                        .toBuffer();
                } catch (error) {
                    console.error("Error fetching user image:", error);
                    userImage = null;
                }
            }

            // Read and encode the font file
            const fontBuffer = await fs.readFile(fontPath);
            const fontBase64 = fontBuffer.toString("base64");

            // Create a text SVG with embedded font
            const svgImage = `
                <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <style type="text/css">
                            @font-face {
                                font-family: 'CustomFont';
                                src: url(data:font/ttf;base64,${fontBase64}) format('truetype');
                            }
                            .title { fill: #111; font-size: 60px; font-weight: bold; font-family: 'CustomFont'; }
                            .content { fill: #444; font-size: 30px; font-family: 'CustomFont'; }
                        </style>
                    </defs>
                    <text x="50" y="100" class="title">${title}</text>
                    <text x="50" y="200" class="content">${content.substring(
                        0,
                        100
                    )}...</text>
                </svg>
            `;

            // Composite everything together
            let image = baseImage;
            if (userImage) {
                image = image.composite([
                    { input: userImage, top: 460, left: 50 },
                ]);
            }
            image = image.composite([
                { input: Buffer.from(svgImage), top: 0, left: 0 },
            ]);

            // Generate output
            return await image.png().toBuffer();
        } catch (error) {
            console.error("Error generating OG image:", error);
            throw error;
        }
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
