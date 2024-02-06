const mongoose = require("mongoose")
const { Schema } = mongoose

const ProductsSchema = new Schema({
    name: String,
    productImage: {
        type: String,
        default: "/public/img/default_image.png"
    }
})

module.exports = mongoose.model("Products", ProductsSchema, "products")