import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        author: {
            type: String,
            required: false,
            default: "Unknown",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
