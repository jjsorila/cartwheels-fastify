import mongoose from 'mongoose'
const { Schema } = mongoose

const ProductsSchema = new Schema({
    name: String,
    productImage: {
        type: String,
        default: "/public/img/default_image.png"
    }
})

export default mongoose.model("Products", ProductsSchema, "products")