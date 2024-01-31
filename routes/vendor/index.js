module.exports = async(app, opts) => {
    ////REDIRECT LOGGED OUT VENDORS
    const onRequest = async(request, reply) => {
        if(!request.session?.user) return reply.redirect("/auth")
    }

    app.get("/dashboard", { onRequest }, async(request, reply) => {
        return reply.view("vendor/dashboard.ejs")
    })
}