module.exports = async(app, opts) => {
    ////REDIRECT LOGGED OUT VENDORS
    const preHandler = async(request, reply) => {
        if(!request.session?.user) return reply.redirect("/auth")
    }

    app.get("/dashboard", { preHandler }, async(request, reply) => {
        return reply.view("vendor/dashboard.ejs")
    })
}