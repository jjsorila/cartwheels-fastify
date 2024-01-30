const mongoose = require("mongoose")
const { Schema } = mongoose

const ProductsSchema = new Schema({
    name: String,
    productImage: String
})

module.exports = mongoose.model("Products", ProductsSchema, "products")