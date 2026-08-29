
import mongoose from "mongoose";

export const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://khushitiwari1237_db_user:muZWzgOBeUy6Stpk@cluster0.uu5lew4.mongodb.net/?appName=PropHub")
    .then(()  =>{
        console.log("DB connected");
    })
} 