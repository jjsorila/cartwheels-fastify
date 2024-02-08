import bcrypt from 'bcryptjs'
import path from 'path'
import VendorModel from "../../../models/vendors.js"
import ProductsModel from "../../../models/products.js"
import SendMail from "../../../config/mail.js"
import { v4 } from 'uuid'
import multer from 'fastify-multer'
import fs from "fs/promises"
let uploadedFileName = null
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(process.cwd(),"public","img"))
    },
    filename: function (req, file, cb) {
        uploadedFileName = `${v4()}.jpg`
        cb(null, uploadedFileName)
    }
  })
const upload = multer({ storage })

export default async(app, opts) => {
    app.register(multer.contentParser)

    app.addHook("preHandler", upload.single("img"))

    //REGISTER VENDOR
    app.post("/register", async(request, reply) => {
        try {
            let { fullname, password, businessName, email } = request.body
            const hashedPassword = await bcrypt.hash(password, 10)
            
            const checkEmail = await VendorModel.findOne({ email }).exec()

            if(checkEmail) {
                return { operation: false, msg: "Account already exist" }
            }

            const newVendor = new VendorModel({
                fullname,
                password: hashedPassword,
                businessName,
                email
            })

            await newVendor.save()

            return { operation: true }
        } catch (error) {
            console.log(error)
            return reply.code(500).send({ operation: false, msg: "Server Error" })
        }
    })

    //LOGIN VENDOR
    app.post("/auth", async(request, reply) => {
        try {
            let { email, password } = request.body
            
            const vendor = await VendorModel.findOne({ email }).select("-products").exec()
            if(!vendor) return { operation: false, msg: "Invalid credentials" }

            const checkPassword = await bcrypt.compare(password, vendor.password)
            if(!checkPassword) return { operation: false, msg: "Invalid credentials" }

            request.session.user = vendor

            return { operation: true }

        } catch (error) {
            console.log(error)
            return reply.code(500).send({ operation: false, msg: "Server Error" })
        }
    })

    //LOGOUT VENDOR
    app.delete("/logout", async(request, reply) => {
        try {
            request.session.destroy()
            request.session = null
            return { operation: true }
        } catch (error) {
            console.log(error)
            return reply.code(500).send({ operation: false, msg: "Server Error" })
        }
    })

    //RESET VENDOR PASSWORD
    app.patch("/reset", async(request, reply) => {
        try {
            const { email, password } = request.body

            const hashedPassword = await bcrypt.hash(password, 10)

            await VendorModel.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }).exec()

            return { operation: true }
        } catch (error) {
            console.log(error)
            return reply.code(500).send({ operation: false, msg: "Server Error" })
        }
    })

    //SEND RESET PASSWORD TOKEN
    app.post("/sendreset", async(request, reply) => {
        try {
            const { email } = request.body

            const vendor = await VendorModel.findOne({ email }).exec()

            if(!vendor) return { operation: false, msg: "Email not found" }

            const token = app.jwt.sign({ email })

            await SendMail(email, token, request)

            return { operation: true, msg: "Reset password link sent to email" }
        } catch (error) {
            console.log(error)
            return reply.code(500).send({ operation: false, msg: "Server Error" })
        }
    })

    //UPDATE MAP,BUSINESS,VENDOR
    app.post("/update", async(req, res) => {
        try {
            let { action, _id } = req.body

            switch(action){
                case "map":
                    let { locationName, lat, lng } = req.body

                    await VendorModel.findByIdAndUpdate(_id, { $set: {
                            location: {
                                name: locationName,
                                latitude: lat,
                                longitude: lng
                            }
                        } 
                    }).exec()

                    return { operation: true, msg: "Location Updated!" }
                case "business":
                    let { businessName, description } = req.body

                    const newBusinessInfo = {
                        businessName,
                        description
                    }

                    if(req.file){
                        const vendor = await VendorModel.findById(_id).exec()

                        if(!vendor.businessImage.includes("default_image.png")) await fs.unlink(`${process.cwd()}/${vendor.businessImage}`)

                        newBusinessInfo.businessImage = `/public/img/${uploadedFileName}`
                        uploadedFileName = null
                    }

                    await VendorModel.findByIdAndUpdate(_id,{
                        $set: newBusinessInfo
                    })

                    return { operation: true, msg: "Business Information Updated!" }
                case "vendor":
                    let { fullname, email, password } = req.body

                    const newVendorInfo = {
                        fullname,
                        email
                    }

                    if(password){
                        password = await bcrypt.hash(password, 10)
                        newVendorInfo.password = password
                    }

                    await VendorModel.findByIdAndUpdate(_id, {
                        $set: newVendorInfo
                    })

                    return { operation: true, msg: "Vendor Information Updated!" }
            }

        } catch (error) {
            console.log(error)
            return res.code(500).send({ operation: false, msg: "Server Error" })
        }
    })

    //PRODUCTS OPERATIONS
    app.post("/products", async(req, res) => {
        try {
            const { action, _id } = req.body
            const currentVendor = await VendorModel.findById(_id).populate("products").exec()

            switch(action){
                case "add":
                    const { productName } = req.body

                    const newProduct = new ProductsModel({
                        name: productName,
                        productImage: `/public/img/${uploadedFileName}`
                    })

                    uploadedFileName = null

                    currentVendor.products.push(newProduct._id)

                    await newProduct.save()
                    await currentVendor.save()

                    return { operation: true, msg: "Product Added" };
                case "update":
                    const { updateProductId, newName } = req.body
                    
                    const updateProduct = await ProductsModel.findById(updateProductId).exec()

                    updateProduct.name = newName

                    if(uploadedFileName){
                        await fs.unlink(`${process.cwd()}${updateProduct.productImage}`)
                        updateProduct.productImage = `/public/img/${uploadedFileName}`
                        uploadedFileName = null
                    }
                    
                    await updateProduct.save()

                    return { operation: true, msg: "Product Updated" };
                case "delete":
                    const { productId } = req.body

                    const deleted = await ProductsModel.findByIdAndDelete(productId).exec()

                    const deletedProductIndex = currentVendor.products.indexOf(productId)
                    currentVendor.products.splice(deletedProductIndex, 1)

                    await currentVendor.save()
                    await fs.unlink(`${process.cwd()}${deleted.productImage}`)

                    return { operation: true, msg: "Product Deleted" };
                case "read":
                    return { operation: true, data: currentVendor.products };
            }

        } catch (error) {
            console.log(error)
            return res.code(500).send({ operation: false, msg: "Server Error" })
        }
    })
}