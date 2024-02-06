module.exports = async(app, opts) => {
    ////REDIRECT LOGGED OUT VENDORS
    const onRequest = async(request, reply) => {
        if(!request.session?.user) return reply.redirect("/auth")
    }

    app.addHook("onRequest", onRequest)

    app.get("/dashboard", async(request, reply) => {
        return reply.view("vendor/dashboard.ejs")
    })

    app.get("/settings", async(request, reply) => {
        return reply.view("vendor/settings.ejs")
    })
}
