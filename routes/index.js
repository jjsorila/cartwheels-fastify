import VendorsModel from "../models/vendors.js"

export default async(app, opts) => {
    //REDIRECT LOGGED IN VENDORS
    const onRequest = async(request, reply) => {
        if(request.session?.user) return reply.redirect("/vendor/dashboard")
    }

    app.get("/", async(request, reply) => {
        const vendors = await VendorsModel.find({ location: { $ne: null } }).select("_id businessName businessImage description").exec()
        return reply.view("customer.ejs", { vendors })
    })

    app.get("/info/:_id", async(request, reply) => {
        const { _id } = request.params
        const vendor = await VendorsModel.findById(_id).select("_id businessName description location products").populate("products").exec()
        return reply.view("foodInfo.ejs", { vendor })
    })

    app.get("/auth", { onRequest } , async(request, reply) => {
        return reply.view("auth.ejs")
    })

    app.get("/forgotpassword", { 
        onRequest: async(request, reply) => {
            try {
                const { token } = request.query

                if(!token) return reply.redirect("/auth")

                app.jwt.verify(token, (err, decoded) => {
                    if(err) throw err
                    request.decoded = decoded
                })
            } catch (error) {
                request.log.error(error.code)
                return reply.redirect("/auth")
            }
        }
    }, async(request, reply) => {
        const { email } = request.decoded
        return reply.view("forgot.ejs", { email })
    })
}