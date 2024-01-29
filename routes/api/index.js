module.exports = async(app, opts) => {
    app.get("/", (request, reply) => {
        return "API PAGE"
    })
}