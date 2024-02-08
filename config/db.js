import mongoose from 'mongoose'

export default async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/cartwheels")
        console.log("MongoDB Connected")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}