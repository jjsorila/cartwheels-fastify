module.exports = async(app, opts) => {
    //REDIRECT LOGGED IN VENDORS
    const preHandler = async(request, reply) => {
        if(request.session?.user) return reply.redirect("/vendor/dashboard")
    }

    app.get("/", async(request, reply) => {
        return reply.view("customer.ejs")
    })

    app.get("/info", async(request, reply) => {
        return reply.view("foodInfo.ejs")
    })

    app.get("/auth", { preHandler } , async(request, reply) => {
        return reply.view("auth.ejs")
    })

    app.get("/forgotpassword", async(request, reply) => {
        return reply.view("forgot.ejs")
    })
}