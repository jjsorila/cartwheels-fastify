import mongoose from 'mongoose'
const { Schema } = mongoose

const VendorSchema = new Schema({
    fullname: String,
    dateRegistered: {
        type: Date,
        default: new Date()
    },
    email: String,
    businessImage: {
        type: String,
        default: "/public/img/default_image.png"
    },
    businessName: String,
    password: String,
    location: {
        type: {
            latitude: Number,
            longitude: Number,
            name: String
        },
        default: null
    },
    description: String,
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Products"
    }]
})

export default mongoose.model("Vendor", VendorSchema, "vendors")