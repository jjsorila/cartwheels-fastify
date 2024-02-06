const bcrypt = require("bcryptjs")
const path = require("path")
const VendorModel = require("../../../models/vendors")
const SendMail = require("../../../config/mail")
const { v4 } = require("uuid")
const multer = require('fastify-multer')
const fs = require("fs/promises")
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

module.exports = async(app, opts) => {
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

                        await fs.unlink(`${process.cwd()}/${vendor.businessImage}`)

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
}