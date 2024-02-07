const mongoose = require("mongoose")
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
        latitude: Number,
        longitude: Number,
        name: String
    },
    description: String,
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Products"
    }]
})

module.exports = mongoose.model("Vendor", VendorSchema, "vendors")