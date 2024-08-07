import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";
// D
export async function GET(
    request: NextRequest,
    { params }: { params: { postid: string } }
) {
    await dbConnect();
    if (request) {
        console.log("Body SHody");
    }
    // Function to draw a rounded rectangle
    function drawRoundedRect(
        ctx: any,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // Function to wrap text
    function wrapText(
        ctx: any,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
    ) {
        const words = text.split(" ");
        let line = "";
        let testLine = "";
        let testWidth = 0;

        for (let n = 0; n < words.length; n++) {
            testLine = line + words[n] + " ";
            testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + " ";
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    async function generateOGImage(
        title: string,
        content: string,
        author: string = "",
        imagePath: string
    ) {
        // SIZE
        const width = 1200;
        const height = 630;

        // Images
        const userAvatar = await loadImage(
            path.join(process.cwd(), "public", "avatar.png")
        );
        const medialLogo = await loadImage(
            path.join(process.cwd(), "public", "medial-black.png")
        );
        registerFont(path.join(process.cwd(), "public", "boska.ttf"), {
            family: "boska",
            weight: "bold",
        });
        // VARIABLES
        if (imagePath != "none") {
            title = title.length > 62 ? title.substring(0, 62) + "..." : title;
            content =
                content.length > 117
                    ? content.substring(0, 117) + "..."
                    : content;
        } else {
            title = title.length > 62 ? title.substring(0, 62) + "..." : title;
            content =
                content.length > 450
                    ? content.substring(0, 450) + "..."
                    : content;
        }
        // Create a canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Create a linear gradient from top to bottom

        // If no image
        const allwords = title.split(" ");

        // BACKGROUND
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, width, height);

        // POST HOLDER
        ctx.fillStyle = "#201A2C";
        drawRoundedRect(ctx, 20, 20, 1160, 590, 12);

        // USER AVATAR
        ctx.save(); // Save the current context
        ctx.beginPath();
        ctx.arc(80, 110, 40, 0, Math.PI * 2, true); // (x, y, radius, startAngle, endAngle)
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userAvatar, 40, 70, 80, 80); // (image, dx, dy, dWidth, dHeight)
        ctx.restore(); // Restore the context to avoid clipping other elements

        // MEDIAL LOGO
        ctx.save(); // Save the current context
        ctx.fillStyle = "#fff";
        drawRoundedRect(ctx, 1110, 50, 50, 50, 12);
        ctx.drawImage(medialLogo, 1117, 55, 40, 40); // (image, dx, dy, dWidth, dHeight)
        ctx.restore(); // Restore the context to avoid clipping other elements

        // POST TITLE
        ctx.font = "bold 35pt 'boska'";
        ctx.textAlign = "left";
        ctx.fillStyle = "#fff";
        wrapText(ctx, title, 150, 90, 900, 60);

        // POST TITLE & CONTENT SEPERATOR
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#3e3354";
        ctx.moveTo(150, 190);
        ctx.lineTo(1050, 190);
        ctx.stroke();
        ctx.restore();

        // POST CONTENT
        ctx.font = "bold 22pt 'boska'";
        ctx.textAlign = "left";
        ctx.fillStyle = "gray";
        wrapText(ctx, content, 150, 240, 900, 36);

        // POST IMAGE
        if (imagePath != "none") {
            // Displaying the image
            ctx.save();
            const postImage = await loadImage(imagePath);
            ctx.drawImage(postImage, 150, 300, 900, 300); // (image, dx, dy, dWidth, dHeight)

            ctx.restore();
        }
        if (imagePath != "none") {
            // MEDIAL BRANDING
            ctx.save();

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((90 * Math.PI) / 180);
            ctx.scale(1, 1);
            // Medial App Link
            ctx.font = " 22pt 'boska'";
            ctx.textAlign = "left";
            ctx.fillStyle = "#3e3354";
            ctx.fillText(
                "medial.app",
                -ctx.measureText("medial.app").width / 2,
                -525
            );
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "#3e3354";
            ctx.moveTo(1135, 120);
            ctx.lineTo(1135, 225);
            ctx.stroke();
            ctx.moveTo(1135, 400);
            ctx.lineTo(1135, 570);
            ctx.stroke();
            ctx.restore();
        } else {
            // MEDIAL BRANDING
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "#3e3354";
            ctx.moveTo(150, 570);
            ctx.lineTo(500, 570);
            ctx.stroke();
            ctx.moveTo(700, 570);
            ctx.lineTo(1050, 570);
            ctx.stroke();
            ctx.restore();

            // Medial App Link
            ctx.font = " 22pt 'boska'";
            ctx.textAlign = "left";
            ctx.fillStyle = "#3e3354";
            ctx.fillText("medial.app", 520, 575);
        }

        // Author Information
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((270 * Math.PI) / 180);
        ctx.scale(1, 1);
        ctx.font = " 16pt 'boska'";
        ctx.fillStyle = "gray";
        ctx.fillText(`@${author.replace(" ", "_")}`, 0, -515);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#3e3354";
        ctx.moveTo(75, 330);
        ctx.lineTo(75, 570);
        ctx.stroke();
        ctx.restore();

        // Save the canvas as PNG file
        const buffer = canvas.toBuffer("image/png");
        // Define the file path
        const filePath = path.join(
            process.cwd(),
            "public",
            "generated",
            `${params.postid}.png`
        );

        // Ensure the directory exists
        // if (!fs.existsSync(path.dirname(filePath))) {
        //     fs.mkdirSync(path.dirname(filePath), { recursive: true });
        // }

        // Save the buffer to a file
        // fs.writeFileSync(filePath, buffer);
        return buffer;
        // return buffer;
    }

    try {
        const post = await Post.findById(params.postid);
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }
        // Define the file path where the image will be saved
        const filePath = path.join(
            process.cwd(),
            "public",
            "generated",
            `${params.postid}.png`
        );

        // Check if the image already exists
        if (fs.existsSync(filePath)) {
            // Read the existing file
            const existingImage = fs.readFileSync(filePath);
            return new NextResponse(existingImage, {
                headers: {
                    "Content-Type": "image/png",
                },
            });
        }
        const imageBuffer = await generateOGImage(
            post.title,
            post.content,
            post.author,
            post.image
        );

        // Return the newly created image
        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": "image/png",
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
