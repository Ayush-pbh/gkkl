import mongoose from "mongoose";

const DATABASE_USERNAME = encodeURIComponent(
    process.env.databaseUser as string
);
const DATABASE_PASSWORD = encodeURIComponent(
    process.env.databasePassword as string
);

const DATABASE_URR = encodeURIComponent(process.env.databaseUrl as string);

const MONGODB_URI = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_URR}/?retryWrites=true&w=majority`;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

// Define an interface for the global augmentation
interface GlobalWithMongoose extends Global {
    mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

declare const global: GlobalWithMongoose;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log("DB Connected!");
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
