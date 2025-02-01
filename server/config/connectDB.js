import mongoose from 'mongoose';
import dotenv from'dotenv';
dotenv.config()

if(!process.env.MONGODB_URI){
    throw new Error(
        "Please provide mongoDb uri in .env file"
    )
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Mongo DB connected successfully")
    } catch (error) {
        console.log("MongoDB Connection Failed")
        process.exit(1)
    }
}

export default connectDB