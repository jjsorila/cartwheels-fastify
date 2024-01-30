const bcrypt = require("bcryptjs")
const VendorModel = require("../../../models/vendors")

module.exports = async(app, opts) => {
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
            return reply.code(500).send("Server Error")
        }
    })

    //LOGIN VENDOR
    app.post("/auth", async(request, reply) => {
        try {
            let { email, password } = request.body
            
            const vendor = await VendorModel.findOne({ email }).exec()
            if(!vendor) return { operation: false, msg: "Invalid credentials" }

            const checkPassword = await bcrypt.compare(password, vendor.password)
            if(!checkPassword) return { operation: false, msg: "Invalid credentials" }

            request.session.user = {
                id: vendor._id,
                email: vendor.email,
            }

            return { operation: true }

        } catch (error) {
            console.log(error)
            return reply.code(500).send("Server Error")
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
            return reply.code(500).send("Server Error")
        }
    })
}