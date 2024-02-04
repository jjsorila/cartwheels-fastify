const mongoose = require("mongoose")
const { Schema } = mongoose

const VendorSchema = new Schema({
    fullname: String,
    email: String,
    businessImage: String,
    businessName: String,
    password: String,
    foodCategories: [String],
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