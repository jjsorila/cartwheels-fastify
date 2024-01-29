module.exports = async(app, opts) => {
    app.get("/", async(request, reply) => {
        return reply.view("customer.ejs")
    })

    app.get("/register", async(request, reply) => {
        return reply.view("reg.ejs")
    })

    app.get("/info", async(request, reply) => {
        return reply.view("foodInfo.ejs")
    })

    app.get("/auth", async(request, reply) => {
        return reply.view("auth.ejs")
    })

    app.get("/forgotpassword", async(request, reply) => {
        return reply.view("forgot.ejs")
    })
}